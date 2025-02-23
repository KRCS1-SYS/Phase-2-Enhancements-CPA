import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
} from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  Brush,
} from "recharts";
import moment from "moment";
import { JumboCard, JumboIconButton } from "@jumbo/components";
import { Div } from "@jumbo/shared/Div/Div";
import Typography from "@mui/material/Typography";
import { Stack, Box, CircularProgress, Slider } from "@mui/material";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import CloseFullscreenOutlinedIcon from "@mui/icons-material/CloseFullscreenOutlined";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useParameter } from "@app/_components/_core/ParameterProvider/hooks";
import { useJumboDialog } from "@jumbo/components/JumboDialog/hooks/useJumboDialog";
import { debounce } from "lodash";
import CustomLegend from "./CustomLegend";

const LEGEND_WRAPPER_STYLE = { left: 25, top: -5 };

const SimpleLineChart = ({ tagItem, dashboard, getHistoryData }) => {
  const { loading, historyData } = useParameter();
  const { showDialog, hideDialog } = useJumboDialog();
  const [fullscreen, setFullscreen] = useState(false);
  const apiCalled = useRef(false);

  // State for chart zooming
  const [xDomain, setXDomain] = useState([
    Date.now() - 24 * 60 * 60 * 1000,
    Date.now(),
  ]);
  const [yDomain, setYDomain] = useState([
    tagItem.MinimumRange,
    tagItem.MaximumRange,
  ]);

  // Toggle fullscreen
  const fullScreenHandler = useCallback(() => {
    setFullscreen((prev) => !prev);
  }, []);

  // Convert timestamp once
  const convertTimeToTimestamp = useCallback((timeString) => {
    return new Date(timeString).getTime();
  }, []);

  // Build formatted data
  const formattedData = useMemo(() => {
    if (!historyData?.length) return [];
    return historyData.map((entry) => ({
      time: convertTimeToTimestamp(entry.Timestamp),
      value: entry.Value,
    }));
  }, [historyData, convertTimeToTimestamp]);

  // Show your chart in a full-screen dialog if user clicked fullscreen
  const showContactDetail = useCallback(() => {
    showDialog({
      content: <SimpleLineChart tagItem={tagItem} dashboard={dashboard} />,
      isFullScreen: fullscreen,
    });
  }, [fullscreen, dashboard, showDialog]);

  // On initial mount, fetch data once
  useEffect(() => {
    if (!apiCalled.current) {
      apiCalled.current = true;
      getHistoryData();
    } else {
      // If user toggles fullscreen after data has already been fetched
      showContactDetail();
    }
  }, [fullscreen]);

  // Dynamically update YDomain
  const updateYDomain = useCallback(() => {
    const filteredData = historyData.filter((entry) => entry.Value !== null);
    if (filteredData.length) {
      const values = filteredData.map((entry) => entry.Value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      // Adjust min and max domains based on their sign
      const YAxisMinDomain =
        minValue < 0
          ? Math.round(minValue * 1.3 * 100) / 100
          : Math.round(minValue * 0.7 * 100) / 100;

      const YAxisMaxDomain =
        maxValue > 0
          ? Math.round(maxValue * 1.3 * 100) / 100
          : Math.round(maxValue * 0.7 * 100) / 100;

      setYDomain([
        Math.max(tagItem.MinimumRange, YAxisMinDomain),
        Math.min(tagItem.MaximumRange, YAxisMaxDomain),
      ]);
    }
  }, [historyData, tagItem.MinimumRange, tagItem.MaximumRange]);

  useEffect(() => {
    updateYDomain();
  }, [updateYDomain]);

  // Debounced brush handler
  const handleBrushChange = useMemo(
    () =>
      debounce((brushData) => {
        if (
          brushData &&
          brushData.startIndex !== undefined &&
          brushData.endIndex !== undefined
        ) {
          const start = formattedData[brushData.startIndex]?.time;
          const end = formattedData[brushData.endIndex]?.time;
          if (start && end) {
            setXDomain([start, end]);
          }
        }
      }, 300),
    [formattedData]
  );

  // Memoized tooltip to avoid unnecessary re-renders
  const CustomTooltip = useMemo(() => {
    return function TooltipContent({ payload, label, active }) {
      if (active && payload && payload.length) {
        const dateTimeFormatted = moment(label).format("DD/MM/YYYY HH:mm:ss");
        return (
          <Div
            sx={{
              backgroundColor: "#fff",
              padding: "8px",
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            <Typography variant="body2">{`Date & Time: ${dateTimeFormatted}`}</Typography>
            <Typography variant="body2">{`Value: ${payload[0].value}`}</Typography>
          </Div>
        );
      }
      return null;
    };
  }, []);

  // Generate X-axis ticks. Alternatively, rely on Recharts' auto-tick.
  const xAxisTicks = useMemo(() => {
    const [startTime, endTime] = xDomain;
    const ticks = [];
    const timeRange = endTime - startTime;
    let interval = 60 * 1000; // default 1 min

    if (timeRange > 6 * 60 * 60 * 1000) {
      // over 6 hours
      interval = 60 * 60 * 1000; // 1 hour
    } else if (timeRange > 1 * 60 * 60 * 1000) {
      // between 1 and 6 hours
      interval = 15 * 60 * 1000; // 15 minutes
    }

    for (let t = startTime; t <= endTime; t += interval) {
      ticks.push(t);
    }
    return ticks;
  }, [xDomain]);

  // Handler for Y-Axis slider
  const handleYDomainChange = useCallback((event, newValue) => {
    setYDomain(newValue);
  }, []);

  return (
    <JumboCard
      title={
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Div>
            <Typography variant="h4"> {tagItem.TagName} </Typography>
            <Typography variant="h6"> {tagItem.TagId}</Typography>
            <Typography variant="body1">
              {dashboard === "sugar"
                ? tagItem.InstrumentDescription
                : tagItem.ParameterName}
            </Typography>
          </Div>
          <Stack direction="row" spacing={1}>
            <JumboIconButton onClick={updateYDomain} elevation={2}>
              <RefreshIcon />
            </JumboIconButton>
            <JumboIconButton onClick={fullScreenHandler} elevation={2}>
              {fullscreen ? (
                <CloseFullscreenOutlinedIcon />
              ) : (
                <OpenInFullOutlinedIcon />
              )}
            </JumboIconButton>
            {hideDialog && (
              <JumboIconButton onClick={hideDialog} elevation={2}>
                <CloseIcon sx={{ color: "text.primary" }} />
              </JumboIconButton>
            )}
          </Stack>
        </Stack>
      }
      contentWrapper
      contentSx={{ backgroundColor: "background.paper" }}
    >
      {!loading && historyData && Number.isFinite(yDomain[0]) && (
        <Stack
          spacing={1}
          sx={{ margin: "0 auto", paddingBottom: "1rem", paddingX: "1rem" }}
        >
          <Typography
            gutterBottom
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Y-Axis Range
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ margin: "0 auto", paddingLeft: "2rem" }}
          >
            <Typography
              variant="body2"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              {tagItem.MinimumRange}
            </Typography>
            <Slider
              value={yDomain}
              onChange={handleYDomainChange}
              valueLabelDisplay="auto"
              min={tagItem.MinimumRange}
              max={tagItem.MaximumRange}
              sx={{ marginTop: 0, marginBottom: 0 }}
            />
            <Typography
              variant="body2"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              {tagItem.MaximumRange}
            </Typography>
          </Stack>
        </Stack>
      )}

      <ResponsiveContainer width="100%" height={500}>
        {loading ? (
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : formattedData.length > 0 ? (
          <LineChart
            data={formattedData}
            margin={{ top: 10, right: 40, left: 0, bottom: 60 }}
          >
            <XAxis
              dataKey="time"
              type="number"
              domain={xDomain}
              ticks={xAxisTicks}
              tickFormatter={(time) => moment(time).format("HH:mm")}
              label={{
                value: "Last 24 Hours (IST)",
                position: "bottom",
                offset: 40,
                style: { textAnchor: "middle" },
              }}
            />
            <YAxis
              label={{
                value: `Value (${tagItem.Unit})`,
                angle: -90,
                position: "insideLeft",
                offset: 5,
              }}
              domain={[Math.floor(yDomain[0]), Math.ceil(yDomain[1])]}
              allowDataOverflow
            />
            <Tooltip content={<CustomTooltip />} />
            <CartesianGrid strokeDasharray="3 3" />
            {tagItem.High && (
              <ReferenceLine
                y={tagItem.High}
                stroke="red"
                strokeDasharray="4 4"
                label={{
                  value: `${tagItem.High}`,
                  position: "right",
                  fill: "red",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
            )}
            {tagItem.Low && (
              <ReferenceLine
                y={tagItem.Low}
                stroke="blue"
                strokeDasharray="4 4"
                label={{
                  value: `${tagItem.Low}`,
                  position: "right",
                  fill: "blue",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
            )}
            <Legend
              content={<CustomLegend high={tagItem.High} low={tagItem.Low} />}
              verticalAlign="top"
              align="center"
              wrapperStyle={LEGEND_WRAPPER_STYLE}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              dot={false}
            />
            <Brush
              dataKey="time"
              height={30}
              stroke="#8884d8"
              travellerWidth={10}
              onChange={handleBrushChange}
              tickFormatter={(time) => moment(time).format("HH:mm")}
            />
          </LineChart>
        ) : (
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography variant="body1">No data available.</Typography>
          </Box>
        )}
      </ResponsiveContainer>
    </JumboCard>
  );
};

// Wrap with React.memo to skip re-renders if props are unchanged
export { SimpleLineChart };
