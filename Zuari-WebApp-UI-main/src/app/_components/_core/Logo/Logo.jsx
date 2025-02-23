import { Div, Link } from "@jumbo/shared";
import PropTypes from "prop-types";
import { useSmallScreen } from "@app/_hooks";

const Logo = ({ mini = false, mode = "light", sx }) => {
  const smallScreen = useSmallScreen();
  return (
    <Div sx={{ display: "inline-flex", ...sx }}>
      <Link to={"/"}>
        {!smallScreen ? (
          <img
            src={
              mode === "light"
                ? `/assets/images/zuari_logo.png`
                : `/assets/images/zuari_logo.png`
            }
            alt="Jumbo React"
            width={145}
            height={45}
            style={{ verticalAlign: "middle" }}
          />
        ) : (
          <img
            src={
              mode === "light"
                ? `/assets/images/zuari_logo.png`
                : `/assets/images/zuari_logo.png.png`
            }
            alt="Jumbo React"
            width={105}
            height={33}
            style={{ verticalAlign: "middle" }}
          />
        )}
      </Link>
    </Div>
  );
};

export { Logo };

Logo.propTypes = {
  mini: PropTypes.bool,
  mode: PropTypes.oneOf(["light", "semi-dark", "dark"]),
  sx: PropTypes.object,
};
