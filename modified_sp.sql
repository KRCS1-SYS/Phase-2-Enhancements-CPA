USE [GSMA_SIT]
GO
/****** Object:  StoredProcedure [dbo].[sp_GetHistoricalData]    Script Date: 15-01-2025 01:23:56 PM ******/
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
        i.Path = @TagId + '.Value'
        AND hd.Timestamp >= DATEADD(HOUR, -24, GETDATE())
    ORDER BY 
        hd.Timestamp; 
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_GetPowerCautionTags]    Script Date: 15-01-2025 01:23:56 PM ******/
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
		t.Section,
		t.AssociatedEquipment,
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
/****** Object:  StoredProcedure [dbo].[sp_GetPowerCriticalTags]    Script Date: 15-01-2025 01:23:56 PM ******/
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
		t.Section,
		t.AssociatedEquipment,
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
/****** Object:  StoredProcedure [dbo].[sp_GetPowerIdealTags]    Script Date: 15-01-2025 01:23:56 PM ******/
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
		t.Section,
		t.AssociatedEquipment,
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
/****** Object:  StoredProcedure [dbo].[sp_GetSugarCautionTags]    Script Date: 15-01-2025 01:23:56 PM ******/
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
		t.ApplicationName,
		t.Area,
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
/****** Object:  StoredProcedure [dbo].[sp_GetSugarCriticalTags]    Script Date: 15-01-2025 01:23:56 PM ******/
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
		t.ApplicationName,
		t.Area,
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
/****** Object:  StoredProcedure [dbo].[sp_GetSugarIdealTags]    Script Date: 15-01-2025 01:23:56 PM ******/
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
		t.ApplicationName,
		t.Area,
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
