-- Update SugarPlantTags Table
ALTER TABLE SugarPlantTags
ADD IsActive BIT DEFAULT 1 NOT NULL;

-- Update PowerPlantTags Table
ALTER TABLE PowerPlantTags
ADD IsActive BIT DEFAULT 1 NOT NULL;

test