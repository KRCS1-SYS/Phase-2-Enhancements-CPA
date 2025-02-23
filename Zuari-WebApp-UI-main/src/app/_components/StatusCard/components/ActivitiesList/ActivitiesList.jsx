//TODO: remove dependency of passing Icon Component in data
import { Timeline } from '@mui/lab';
import { statusCard } from '../../data';
import { ActivitiesItem } from '../ActivitiesItem';

function ActivitiesList() {
  return (
    <Timeline sx={{ m: 0, p: (theme) => theme.spacing(0, 3) }}>
      {statusCard.map((item, index) => (
        <ActivitiesItem item={item} key={index} />
      ))}
    </Timeline>
  );
}

export { ActivitiesList };
