import React, { memo, useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { createSvgIcon, Typography, Grid, Box } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import {
  CCFormSelectCard,
  CCFormTitle,
  CCFormSubtitle,
} from "./ThemedComponents";

const FormCard = ({ card, isActive, onClick }) => {
  const CardIcon =
    card.icon &&
    createSvgIcon(
      <path fillRule="evenodd" clipRule="evenodd" d={card.icon.path} />,
      "CardIcon",
    );

  return (
    <Grid size={{ xs: 12, md: card.size || 3 }} display="flex">
      <CCFormSelectCard
        elevation={1}
        className={isActive ? "active" : ""}
        onClick={onClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClick(e);
          }
        }}
      >
        <CardContent sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: "0.625rem",
              }}
            >
              {card.icon && (
                <CardIcon
                  sx={{
                    width: "1.5rem",
                    height: "1.5rem",
                  }}
                />
              )}

              <Typography variant="subtitle1">{card.title}</Typography>
            </Box>
            {/* <Typography variant="body2">{card["short-description"]}</Typography> */}
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <span dangerouslySetInnerHTML={{ __html: card.description }} />
            </Typography>
          </Box>
        </CardContent>
      </CCFormSelectCard>
    </Grid>
  );
};

// props validation
FormCard.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    "short-description": PropTypes.string,
    name: PropTypes.string.isRequired,
    "on-select": PropTypes.shape({
      "continue-step": PropTypes.string.isRequired,
    }).isRequired,
    icon: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }),
    size: PropTypes.number,
  }),
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const CardsSelect = ({ stepName, config, stepData, onApply }) => {
  // todo: fix chosen card for the third step
  // if it has active card, show next step too

  const { title, description, cards, gap } = config;
  const [selected, setSelected] = useState(stepData);

  const handleSelect = useCallback(
    (cardData) => {
      setSelected(cardData.name);
      onApply(stepName, cardData.name, cardData["on-select"]["continue-step"]);
    },
    [onApply, stepName],
  );

  const renderedCards = useMemo(
    () =>
      cards?.map((card) => (
        <MemoizedFormCard
          isActive={card.name === selected}
          key={card.title} // Assuming card.title is unique
          card={card}
          onClick={() => handleSelect(card)}
        />
      )),
    [cards, selected, handleSelect],
  );

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <CCFormTitle variant="h6">{title}</CCFormTitle>
        {description && <CCFormSubtitle>{description}</CCFormSubtitle>}
      </Grid>
      <Grid container spacing={gap || 2} alignItems={"stretch"}>
        {renderedCards}
      </Grid>
    </Grid>
  );
};

const MemoizedFormCard = memo(FormCard);

// props validation
CardsSelect.propTypes = {
  stepName: PropTypes.string.isRequired,
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    cards: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        "short-description": PropTypes.string,
        name: PropTypes.string.isRequired,
        "on-select": PropTypes.shape({
          "continue-step": PropTypes.string.isRequired,
        }).isRequired,
        icon: PropTypes.shape({
          path: PropTypes.string.isRequired,
        }),
        size: PropTypes.number,
      }),
    ),
    gap: PropTypes.number,
  }).isRequired,
  stepData: PropTypes.string,
  onApply: PropTypes.func.isRequired,
};

export default CardsSelect;
