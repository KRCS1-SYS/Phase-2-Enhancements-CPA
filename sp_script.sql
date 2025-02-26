USE [GSMA_SIT]
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteHistoricalData]    Script Date: 10-01-2025 01:12:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_DeleteHistoricalData]
AS
BEGIN
    SET NOCOUNT ON;

    -- Step 1: Use Batch Processing to Delete Old Data
    DECLARE @BatchSize INT = 10000;

    WHILE (1 = 1)
    BEGIN
        -- Delete records in batches
        DELETE TOP (@BatchSize) FROM HistoricalData
        WHERE Timestamp < DATEADD(HOUR, -24, GETDATE());

        -- Exit the loop if no rows are deleted
        IF @@ROWCOUNT = 0 BREAK;

        -- Add a small delay to reduce contention
        WAITFOR DELAY '00:00:01';
    END;
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_GetHistoricalData]    Script Date: 10-01-2025 01:12:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetHistoricalData]
    @TagId NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        CASE 
            -- Handle Boolean values
            WHEN i.DataType = 'Boolean' THEN 
                CASE 
                    WHEN hd.Value = 'True' THEN 1
                    WHEN hd.Value = 'False' THEN 0
                    ELSE NULL
                END
            -- Handle Numeric values
            ELSE 
                TRY_CAST(hd.Value AS FLOAT)
        END AS Value,
        hd.Timestamp
    FROM 
        HistoricalData hd
    INNER JOIN 
        Items i ON hd.ID = i.ID
    WHERE 
        i.Path LIKE '%' + @TagId + '.Value'
        AND hd.Timestamp >= DATEADD(HOUR, -24, GETDATE())
    ORDER BY 
        hd.Timestamp; 
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_GetPowerCautionTags]    Script Date: 10-01-2025 01:12:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetPowerCautionTags]
AS
BEGIN
    SET NOCOUNT ON;

    -- Step 1: Precompute Historical Out-of-Range Data into a Temporary Table
    IF OBJECT_ID('tempdb..#HistoricalOutOfRange') IS NOT NULL
        DROP TABLE #HistoricalOutOfRange;

    SELECT DISTINCT
        ih.Path
    INTO #HistoricalOutOfRange
    FROM 
        HistoricalData h WITH (NOLOCK)
    INNER JOIN 
        Items ih WITH (NOLOCK) ON h.ID = ih.ID
    INNER JOIN 
        PowerPlantTags t WITH (NOLOCK) ON ih.Path = 'Applications.' + t.Section + '.' + t.TagId + '.Value'
    WHERE 
        h.Timestamp >= DATEADD(HOUR, -24, GETDATE())
        AND (
            -- Boolean out-of-range condition
            (ih.DataType = 'Boolean' AND (h.Value = 'True' OR h.Value = 'False'))
            OR
            -- Numeric out-of-range condition
            (ih.DataType <> 'Boolean' AND (
                TRY_CAST(h.Value AS FLOAT) < ISNULL(t.Low, -99999) OR 
                TRY_CAST(h.Value AS FLOAT) > ISNULL(t.High, 99999)
            ))
        );

    -- Step 2: Create an Index on the Temporary Table
    CREATE CLUSTERED INDEX IX_HistoricalOutOfRange_Path ON #HistoricalOutOfRange(Path);

    -- Step 3: Retrieve Caution Tags
    SELECT 
        t.TagId,
        t.TagName,
        t.MeasurementUnit,
        t.ParameterName,
        t.SignalType,
        t.MinimumRange,
        t.MaximumRange,
        t.Low,
        t.High,
        CASE 
            WHEN i.DataType = 'Boolean' THEN 
                CASE 
                    WHEN i.Value = 'True' THEN 1
                    WHEN i.Value = 'False' THEN 0
                    ELSE NULL
                END
            ELSE 
                ROUND(TRY_CAST(i.Value AS FLOAT), 2)
        END AS Value,
        'Caution' AS State
    FROM 
        PowerPlantTags t WITH (NOLOCK)
    INNER JOIN 
        Items i WITH (NOLOCK) ON i.Path = 'Applications.' + t.Section + '.' + t.TagId + '.Value'
    WHERE 
        i.DataType <> 'Boolean' AND
        TRY_CAST(i.Value AS FLOAT) BETWEEN ISNULL(t.Low, TRY_CAST(i.Value AS FLOAT)) AND ISNULL(t.High, TRY_CAST(i.Value AS FLOAT))
        AND EXISTS (
            SELECT 1
            FROM #HistoricalOutOfRange hor
            WHERE hor.Path = 'Applications.' + t.Section + '.' + t.TagId + '.Value'
        )
    ORDER BY 
        t.TagId;

    -- Clean up the Temporary Table
    DROP TABLE #HistoricalOutOfRange;
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_GetPowerCriticalTags]    Script Date: 10-01-2025 01:12:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetPowerCriticalTags]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        t.TagId,
        t.TagName,
        t.MeasurementUnit,
        t.ParameterName,
        t.SignalType,
        t.MinimumRange,
        t.MaximumRange,
        t.Low,
        t.High,
        CASE 
            WHEN i.DataType = 'Boolean' THEN 
                CASE 
                    WHEN i.Value = 'True' THEN 1
                    WHEN i.Value = 'False' THEN 0
                    ELSE NULL
                END
            ELSE 
                ROUND(TRY_CAST(i.Value AS FLOAT), 2)
        END AS Value,
        'Critical' AS State
    FROM 
        PowerPlantTags t WITH (NOLOCK)
    INNER JOIN 
        Items i WITH (NOLOCK) ON i.Path = 'Applications.' + t.Section + '.' + t.TagId + '.Value'
    WHERE 
        (t.Low IS NOT NULL AND i.DataType <> 'Boolean' AND TRY_CAST(i.Value AS FLOAT) < t.Low) OR
        (t.High IS NOT NULL AND i.DataType <> 'Boolean' AND TRY_CAST(i.Value AS FLOAT) > t.High)
    ORDER BY 
        t.TagId;
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_GetPowerIdealTags]    Script Date: 10-01-2025 01:12:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetPowerIdealTags]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        t.TagId,
        t.TagName,
        t.MeasurementUnit,
        t.ParameterName,
        t.SignalType,
        t.MinimumRange,
        t.MaximumRange,
        t.Low,
        t.High,
        CASE 
            WHEN i.DataType = 'Boolean' THEN 
                CASE 
                    WHEN i.Value = 'True' THEN 1
                    WHEN i.Value = 'False' THEN 0
                    ELSE NULL
                END
            ELSE 
                ROUND(TRY_CAST(i.Value AS FLOAT), 2)
        END AS Value,
        'Ideal' AS State
    FROM 
        PowerPlantTags t WITH (NOLOCK)
    INNER JOIN 
        Items i WITH (NOLOCK) ON i.Path = 'Applications.' + t.Section + '.' + t.TagId + '.Value'
    WHERE 
        NOT EXISTS (
            SELECT 1
            FROM HistoricalData h WITH (NOLOCK)
            INNER JOIN Items ih WITH (NOLOCK) ON h.ID = ih.ID
            WHERE ih.Path = 'Applications.' + t.Section + '.' + t.TagId + '.Value'
              AND h.Timestamp >= DATEADD(HOUR, -24, GETDATE())
              AND (
                  (ih.DataType = 'Boolean' AND 
                   (h.Value = 'True' OR h.Value = 'False')
                  )
                  OR
                  (ih.DataType <> 'Boolean' AND 
                   (
                       (t.Low IS NOT NULL AND TRY_CAST(h.Value AS FLOAT) < t.Low) OR
                       (t.High IS NOT NULL AND TRY_CAST(h.Value AS FLOAT) > t.High)
                   )
                  )
              )
        )
    ORDER BY 
        t.TagId;
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_GetPowerRealTimeValuesByEquipment]    Script Date: 10-01-2025 01:12:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetPowerRealTimeValuesByEquipment]
    @AssociatedEquipment NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- Step 1: Retrieve Latest Values for Relevant Paths
    IF OBJECT_ID('tempdb..#LatestItemValues') IS NOT NULL
        DROP TABLE #LatestItemValues;

    SELECT 
        i.Path,
        MAX(i.Timestamp) AS LatestTimestamp
    INTO #LatestItemValues
    FROM Items i WITH (NOLOCK)
    INNER JOIN PowerPlantTags t WITH (NOLOCK) 
        ON i.Path = 'Applications.' + t.Section + '.' + t.TagId + '.Value'
    WHERE t.AssociatedEquipment = @AssociatedEquipment
    GROUP BY i.Path;

    -- Step 2: Main Query for Real-Time Values
    SELECT 
        t.TagId,
        CASE 
            -- Handle Boolean values
            WHEN i.DataType = 'Boolean' THEN 
                CASE 
                    WHEN i.Value = 'True' THEN 1
                    WHEN i.Value = 'False' THEN 0
                    ELSE NULL
                END
            ELSE 
                ROUND(TRY_CAST(i.Value AS FLOAT), 2)
        END AS Value,
        CASE
            -- Critical: Current value is out of range
            WHEN (t.Low IS NOT NULL AND i.DataType <> 'Boolean' AND TRY_CAST(i.Value AS FLOAT) < t.Low) OR
                 (t.High IS NOT NULL AND i.DataType <> 'Boolean' AND TRY_CAST(i.Value AS FLOAT) > t.High) THEN 'Critical'

            -- Caution: Current value is within range but was out of range in the last 24 hours
            WHEN (i.DataType <> 'Boolean' AND 
                  TRY_CAST(i.Value AS FLOAT) BETWEEN ISNULL(t.Low, TRY_CAST(i.Value AS FLOAT)) AND ISNULL(t.High, TRY_CAST(i.Value AS FLOAT))
                 )
                 AND EXISTS (
                     SELECT 1 
                     FROM HistoricalData h WITH (NOLOCK)
                     INNER JOIN Items ih WITH (NOLOCK) ON h.ID = ih.ID
                     WHERE ih.Path = 'Applications.' + t.Section + '.' + t.TagId + '.Value'
                       AND h.Timestamp >= DATEADD(HOUR, -24, GETDATE())
                       AND (
                           (ih.DataType = 'Boolean' AND (h.Value = 'True' OR h.Value = 'False'))
                           OR
                           (ih.DataType <> 'Boolean' AND (
                               (t.Low IS NOT NULL AND TRY_CAST(h.Value AS FLOAT) < t.Low) OR
                               (t.High IS NOT NULL AND TRY_CAST(h.Value AS FLOAT) > t.High)
                           ))
                       )
                 ) THEN 'Caution'

            -- Ideal: Fallback for all other cases
            ELSE 'Ideal'
        END AS State
    FROM 
        Items i WITH (NOLOCK)
    INNER JOIN #LatestItemValues lv ON i.Path = lv.Path AND i.Timestamp = lv.LatestTimestamp
    INNER JOIN PowerPlantTags t WITH (NOLOCK) 
        ON i.Path = 'Applications.' + t.Section + '.' + t.TagId + '.Value'
    WHERE 
        t.AssociatedEquipment = @AssociatedEquipment
    ORDER BY 
        t.TagId;

    -- Step 3: Clean up Temporary Table
    DROP TABLE #LatestItemValues;
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_GetSugarCautionTags]    Script Date: 10-01-2025 01:12:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetSugarCautionTags]
AS
BEGIN
    SET NOCOUNT ON;

    -- Step 1: Precompute Historical Out-of-Range Data into a Temporary Table
    IF OBJECT_ID('tempdb..#HistoricalOutOfRange') IS NOT NULL
        DROP TABLE #HistoricalOutOfRange;

    SELECT DISTINCT
        ih.Path
    INTO #HistoricalOutOfRange
    FROM 
        HistoricalData h WITH (NOLOCK)
    INNER JOIN 
        Items ih WITH (NOLOCK) ON h.ID = ih.ID
    INNER JOIN 
        SugarPlantTags t WITH (NOLOCK) ON ih.Path = 'Applications.' + t.ApplicationName + '.Value'
    WHERE 
        h.Timestamp >= DATEADD(HOUR, -24, GETDATE())
        AND (
            -- Boolean out-of-range condition
            (ih.DataType = 'Boolean' AND (h.Value = 'True' OR h.Value = 'False'))
            OR
            -- Numeric out-of-range condition
            (ih.DataType <> 'Boolean' AND (
                TRY_CAST(h.Value AS FLOAT) < ISNULL(t.Low, -99999) OR 
                TRY_CAST(h.Value AS FLOAT) > ISNULL(t.High, 99999)
            ))
        );

    -- Step 2: Create an Index on the Temporary Table
    CREATE CLUSTERED INDEX IX_HistoricalOutOfRange_Path ON #HistoricalOutOfRange(Path);

    -- Step 3: Retrieve Caution Tags
    SELECT 
        t.TagId,
        t.TagName,
        t.Unit,
        t.InstrumentDescription,
        t.IOType,
        t.MinimumRange,
        t.MaximumRange,
        t.Low,
        t.High,
        CASE 
            WHEN i.DataType = 'Boolean' THEN 
                CASE 
                    WHEN i.Value = 'True' THEN 1
                    WHEN i.Value = 'False' THEN 0
                    ELSE NULL
                END
            ELSE 
                ROUND(TRY_CAST(i.Value AS FLOAT), 2)
        END AS Value,
        'Caution' AS State
    FROM 
        SugarPlantTags t WITH (NOLOCK)
    INNER JOIN 
        Items i WITH (NOLOCK) ON i.Path = 'Applications.' + t.ApplicationName + '.Value'
    WHERE 
        i.DataType <> 'Boolean' AND
        TRY_CAST(i.Value AS FLOAT) BETWEEN ISNULL(t.Low, TRY_CAST(i.Value AS FLOAT)) AND ISNULL(t.High, TRY_CAST(i.Value AS FLOAT))
        AND EXISTS (
            SELECT 1
            FROM #HistoricalOutOfRange hor
            WHERE hor.Path = 'Applications.' + t.ApplicationName + '.Value'
        )
    ORDER BY 
        t.TagId;

    -- Clean up the Temporary Table
    DROP TABLE #HistoricalOutOfRange;
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_GetSugarCriticalTags]    Script Date: 10-01-2025 01:12:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetSugarCriticalTags]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        t.TagId,
        t.TagName,
        t.Unit,
        t.InstrumentDescription,
        t.IOType,
        t.MinimumRange,
        t.MaximumRange,
        t.Low,
        t.High,
        CASE 
            WHEN i.DataType = 'Boolean' THEN 
                CASE 
                    WHEN i.Value = 'True' THEN 1
                    WHEN i.Value = 'False' THEN 0
                    ELSE NULL
                END
            ELSE 
                ROUND(TRY_CAST(i.Value AS FLOAT), 2)
        END AS Value,
        'Critical' AS State
    FROM 
        SugarPlantTags t WITH (NOLOCK)
    INNER JOIN 
        Items i WITH (NOLOCK) ON i.Path = 'Applications.' + t.ApplicationName + '.Value'
    WHERE 
        (t.Low IS NOT NULL AND i.DataType <> 'Boolean' AND TRY_CAST(i.Value AS FLOAT) < t.Low) OR
        (t.High IS NOT NULL AND i.DataType <> 'Boolean' AND TRY_CAST(i.Value AS FLOAT) > t.High)
    ORDER BY 
        t.TagId;
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_GetSugarIdealTags]    Script Date: 10-01-2025 01:12:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetSugarIdealTags]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        t.TagId,
        t.TagName,
        t.Unit,
        t.InstrumentDescription,
        t.IOType,
        t.MinimumRange,
        t.MaximumRange,
        t.Low,
        t.High,
        CASE 
            WHEN i.DataType = 'Boolean' THEN 
                CASE 
                    WHEN i.Value = 'True' THEN 1
                    WHEN i.Value = 'False' THEN 0
                    ELSE NULL
                END
            ELSE 
                ROUND(TRY_CAST(i.Value AS FLOAT), 2)
        END AS Value,
        'Ideal' AS State
    FROM 
        SugarPlantTags t WITH (NOLOCK)
    INNER JOIN 
        Items i WITH (NOLOCK) ON i.Path = 'Applications.' + t.ApplicationName + '.Value'
    WHERE 
        NOT EXISTS (
            SELECT 1
            FROM HistoricalData h WITH (NOLOCK)
            INNER JOIN Items ih WITH (NOLOCK) ON h.ID = ih.ID
            WHERE ih.Path = 'Applications.' + t.ApplicationName + '.Value'
              AND h.Timestamp >= DATEADD(HOUR, -24, GETDATE())
              AND (
                  (ih.DataType = 'Boolean' AND (h.Value = 'True' OR h.Value = 'False'))
                  OR
                  (ih.DataType <> 'Boolean' AND (
                      TRY_CAST(h.Value AS FLOAT) < t.Low OR 
                      TRY_CAST(h.Value AS FLOAT) > t.High
                  ))
              )
        )
    ORDER BY 
        t.TagId;
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_GetSugarRealTimeValuesByArea]    Script Date: 10-01-2025 01:12:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_GetSugarRealTimeValuesByArea]
    @Area NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- Step 1: Retrieve Latest Values for Relevant Paths
    IF OBJECT_ID('tempdb..#LatestItemValues') IS NOT NULL
        DROP TABLE #LatestItemValues;

    SELECT 
        i.Path,
        MAX(i.Timestamp) AS LatestTimestamp
    INTO #LatestItemValues
    FROM Items i WITH (NOLOCK)
    INNER JOIN SugarPlantTags t WITH (NOLOCK) 
        ON i.Path = 'Applications.' + t.ApplicationName + '.Value'
    WHERE t.Area = @Area
    GROUP BY i.Path;

    -- Step 2: Main Query for Real-Time Values
    SELECT 
        t.TagId,
        CASE 
            -- Handle Boolean values
            WHEN i.DataType = 'Boolean' THEN 
                CASE 
                    WHEN i.Value = 'True' THEN 1
                    WHEN i.Value = 'False' THEN 0
                    ELSE NULL
                END
            ELSE 
                ROUND(TRY_CAST(i.Value AS FLOAT), 2)
        END AS Value,
        CASE
            -- Critical: Current value is out of range
            WHEN (t.Low IS NOT NULL AND i.DataType <> 'Boolean' AND TRY_CAST(i.Value AS FLOAT) < t.Low) OR
                 (t.High IS NOT NULL AND i.DataType <> 'Boolean' AND TRY_CAST(i.Value AS FLOAT) > t.High) THEN 'Critical'

            -- Caution: Current value is within range but was out of range in the last 24 hours
            WHEN (i.DataType <> 'Boolean' AND 
                  TRY_CAST(i.Value AS FLOAT) BETWEEN ISNULL(t.Low, TRY_CAST(i.Value AS FLOAT)) AND ISNULL(t.High, TRY_CAST(i.Value AS FLOAT))
                 )
                 AND EXISTS (
                     SELECT 1 
                     FROM HistoricalData h WITH (NOLOCK)
                     INNER JOIN Items ih WITH (NOLOCK) ON h.ID = ih.ID
                     WHERE ih.Path = 'Applications.' + t.ApplicationName + '.Value'
                       AND h.Timestamp >= DATEADD(HOUR, -24, GETDATE())
                       AND (
                           (ih.DataType = 'Boolean' AND (h.Value = 'True' OR h.Value = 'False'))
                           OR
                           (ih.DataType <> 'Boolean' AND (
                               (t.Low IS NOT NULL AND TRY_CAST(h.Value AS FLOAT) < t.Low) OR
                               (t.High IS NOT NULL AND TRY_CAST(h.Value AS FLOAT) > t.High)
                           ))
                       )
                 ) THEN 'Caution'

            -- Ideal: Fallback for all other cases
            ELSE 'Ideal'
        END AS State
    FROM 
        Items i WITH (NOLOCK)
    INNER JOIN #LatestItemValues lv ON i.Path = lv.Path AND i.Timestamp = lv.LatestTimestamp
    INNER JOIN SugarPlantTags t WITH (NOLOCK) 
        ON i.Path = 'Applications.' + t.ApplicationName + '.Value'
    WHERE 
        t.Area = @Area
    ORDER BY 
        t.TagId;

    -- Step 3: Clean up Temporary Table
    DROP TABLE #LatestItemValues;
END;

GO
