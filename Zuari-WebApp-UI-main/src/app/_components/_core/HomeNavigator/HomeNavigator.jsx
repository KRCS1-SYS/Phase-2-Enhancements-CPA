import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { JumboIconButton } from "@jumbo/components";
import { PageHeader } from '@app/_components/layout/Header/components/PageHeader/PageHeader';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const HomeNavigator = ({ title }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/'); 
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      mt={1}
      pt={0}
      mb={2}
    >
      <JumboIconButton elevation={2} onClick={handleHomeClick}  sx={{pt : "0", pr : ".1rem"}} backgroundColor={"primary.main"}>
        <HomeIcon color={"red"} fontSize="large"/>
      </JumboIconButton>
      <JumboIconButton elevation={25}   sx={{pt : "0" }} >
        <ArrowForwardIosIcon fontSize={"small"}/>
      </JumboIconButton>
      <PageHeader title={title} customMargin={0} />
    </Box>
  );
};

HomeNavigator.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HomeNavigator;