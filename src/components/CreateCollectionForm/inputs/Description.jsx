import React from "react";
import PropTypes from "prop-types";
import { CCFormDescription } from "../ThemedComponents.jsx";
import { Typography, useTheme } from "@mui/material";
import { ExternalLink } from "lucide-react";

const Description = ({ config, sx = {} }) => {
  const theme = useTheme();
  const link = config?.link;
  const linkText = config?.linkText || "Learn more";

  return (
    <CCFormDescription
      elevation={0}
      sx={{
        "& code": {
          borderRadius: "4px",
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paperElevation1,
          padding: "2px 4px",
        },
      }}
    >
      <Typography variant="caption" sx={{ ...sx }}>
        {/* here we can use `dangerouslySetInnerHTML` because the content source is trusted */}
        {/* but do not use it with untrusted content */}
        <span dangerouslySetInnerHTML={{ __html: config.description }} />
        &nbsp;
        {link && (
          <a href={link} target="_blank" rel="noreferrer">
            {linkText}
            <ExternalLink size={16} />
          </a>
        )}
      </Typography>
    </CCFormDescription>
  );
};

// props validation
Description.propTypes = {
  config: PropTypes.shape({
    link: PropTypes.string,
    linkText: PropTypes.string,
    description: PropTypes.string.isRequired,
  }).isRequired,
  sx: PropTypes.object,
};

export default Description;
