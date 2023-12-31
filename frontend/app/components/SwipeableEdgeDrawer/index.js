import * as React from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
// import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
// import Skeleton from "@mui/material/Skeleton";
// import Typography from '@mui/material/Typography';
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import Card from "@/app/components/Card";
import MunicipalCard from "@/app/components/MunicipalCard";
import "./SwipeableEdgeDrawer.css";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const programTypes = [
  "Day Care",
  "Family Day Home",
  "Municipally Licenced Day Home",
  "Group Family Child Care",
  "Preschool",
  "Out of School Care",
];

const drawerBleeding = 56;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

function SwipeableEdgeDrawer(props) {
  const {
    window,
    childCares,
    uuidsClicked,
    uuidHovered,
    handleCardMouseEnter,
    handleCardMouseLeave,
    handleShowModel,
    ratingValue,
    capacityValue,
    selectedChips,
    includeWoReviews,
    searchInput,
    setSearchInput,
    openSwipeableDrawer,
    setOpenSwipeableDrawer,
  } = props;

  const toggleDrawer = (newOpen) => () => {
    setOpenSwipeableDrawer(newOpen);
  };

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const filterOn = !(
    ratingValue[0] === 0 &&
    ratingValue[1] === 5 &&
    capacityValue[0] === 0 &&
    capacityValue[1] === 1100 &&
    selectedChips.every((chip) => !chip) &&
    includeWoReviews === true
  );

  const getFilteredChildCares = (arr) => {
    const filteredChildCares = arr.filter((item) => {
      return (
        item.capacity >= capacityValue[0] &&
        item.capacity <= capacityValue[1] &&
        ((item.rating >= ratingValue[0] && item.rating !== null) ||
          (includeWoReviews && item.rating === null)) &&
        item.rating <= ratingValue[1] &&
        ((selectedChips[0] && item.type === programTypes[0]) ||
          (selectedChips[1] && item.type === programTypes[1]) ||
          (selectedChips[2] && item.type === programTypes[2]) ||
          (selectedChips[3] && item.type === programTypes[3]) ||
          (selectedChips[4] && item.type === programTypes[4]) ||
          (!selectedChips[0] &&
            !selectedChips[1] &&
            !selectedChips[2] &&
            !selectedChips[3] &&
            !selectedChips[4])) &&
        (item.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.type?.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.address?.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.city?.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.postalCode?.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.phoneNumber?.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.website?.toLowerCase().includes(searchInput.toLowerCase()))
      );
    });
    return filteredChildCares;
  };

  const filteredChildCares = getFilteredChildCares(childCares);

  const clickedChildCareFirstIndex = filteredChildCares.findIndex(
    (childCare) => {
      return uuidsClicked.some((uuid) => uuid === childCare.uuid);
    }
  );

  // Create a ref for the FixedSizeList component
  const listRef = React.useRef(null);

  React.useEffect(() => {
    scrollToTop();
  }, [uuidsClicked]);

  // Function to scroll to the top of the list
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo(clickedChildCareFirstIndex * 208);
    }
  };

  // Effect to open the drawer when uuidsClicked is not empty
  React.useEffect(() => {
    if (uuidsClicked.length > 0) {
      setOpenSwipeableDrawer(true);
    }
  }, [uuidsClicked]);

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(100% - ${drawerBleeding}px - 64px)`,
            overflow: "visible",
          },
        }}
      />
      {/* <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Button onClick={toggleDrawer(true)}>Open</Button>
      </Box> */}
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={openSwipeableDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <div className="pl-5 pr-5 flex py-1 items-end justify-start">
            {openSwipeableDrawer ? (
              <TextField
                id="standard-basic"
                label="Search"
                variant="standard"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full"
              />
            ) : (
              <TextField
                id="standard-basic"
                label="Swipe to Start Searching"
                variant="standard"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full"
              />
            )}
            <div className="flex  justify-between">
              <div className={filterOn ? "text-rose-600 pb-1" : "pb-1"}>
                ({filteredChildCares.length})
              </div>
            </div>
          </div>
          {/* <Typography sx={{ p: 2, color: 'text.secondary' }}>51 results</Typography> */}
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto",
          }}
        >
          {/* <Skeleton variant="rectangular" height="100%" /> */}
          <div className="flex py-1 items-end justify-start">
            <div className="card-container-mobile">
              {filteredChildCares ? (
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      ref={listRef}
                      height={height}
                      itemCount={filteredChildCares.length}
                      itemSize={208}
                      width={width}
                      itemData={filteredChildCares}
                    >
                      {({ index, style }) => (
                        <div style={style}>
                          {filteredChildCares[index].type ===
                          "Municipally Licenced Day Home" ? (
                            <MunicipalCard
                              key={index}
                              childCare={filteredChildCares[index]}
                              uuidHovered={uuidHovered}
                              uuidsClicked={uuidsClicked}
                              handleCardMouseEnter={handleCardMouseEnter}
                              handleCardMouseLeave={handleCardMouseLeave}
                              handleShowModel={handleShowModel}
                            />
                          ) : (
                            <Card
                              key={index}
                              childCare={filteredChildCares[index]}
                              uuidHovered={uuidHovered}
                              uuidsClicked={uuidsClicked}
                              handleCardMouseEnter={handleCardMouseEnter}
                              handleCardMouseLeave={handleCardMouseLeave}
                              handleShowModel={handleShowModel}
                            />
                          )}
                        </div>
                      )}
                    </List>
                  )}
                </AutoSizer>
              ) : (
                ""
              )}
            </div>
          </div>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

SwipeableEdgeDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default SwipeableEdgeDrawer;
