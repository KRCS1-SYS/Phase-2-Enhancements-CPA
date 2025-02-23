import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';

export const statusCard = [
  {
    icon: WarningIcon,
    title: "Critical",
    subTitle: "Highlights critical issues, need immediate action to avoid significant negative impact",
    color: "error",
  },
  {
    icon: WarningIcon,
    title: "Caution",
    subTitle: "Indicate performance is below optimal but not critical, requires attention",
    color: "warning",
  },
  {
    icon: CheckIcon,
    title: "Optimal",
    subTitle: "Represent Ideal or target performance levels",
    color: "success",
  },
];
