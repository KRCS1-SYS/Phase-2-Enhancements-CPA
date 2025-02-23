import { JumboCard, JumboScrollbar } from "@jumbo/components";
import { Chip } from "@mui/material";
import { ActivitiesList } from "./components";
import PropTypes from "prop-types";

function StatusCard({ title, scrollHeight }) {
  return (
    <JumboCard
      title={title}
      contentWrapper={true}
      contentSx={{ px: 0 }}
    >
        <ActivitiesList />
    </JumboCard>
  );
}

export { StatusCard };

StatusCard.propTyeps = {
  title: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
};
