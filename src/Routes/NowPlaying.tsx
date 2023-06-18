import { useQuery } from "react-query";
import {
  IMovie,
  IMovieDetail,
  getMovie,
  getNowPlaying,
  makeImagePath,
} from "../api";
import styled from "styled-components";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useState } from "react";

const Cards = styled(motion.div)`
  display: flex;
  padding: 20px 48px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Card = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  overflow: auto;
`;
const Img = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  width: 200px;
  height: 250px;
  margin: 32px;
  color: red;
  border-radius: 15px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 80vw;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const CloseIcon = styled.svg`
  position: absolute;
  top: 5px;
  right: 5px;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.div`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 18px;
`;

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

const imgVariants = {
  hover: {
    scale: 1.2,
  },
};

const bigMovieVariants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
  leaving: {
    opacity: 0,
    scale: 0,
  },
};

function NowPlaying() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    "/nowPlaying/movies/:movieId"
  );
  const { data } = useQuery(["movie", "NowPlaying"], getNowPlaying);
  const onOverlayClick = () => history.push("/nowPlaying");
  const { scrollY } = useViewportScroll();

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie: any) => movie.id === +bigMovieMatch.params.movieId
    );

  const [movieData, setMovieData] = useState<IMovieDetail>();
  const onCardClicked = async (movieId: number) => {
    history.push(`/nowPlaying/movies/${movieId}`);
    const newMovieData = await getMovie(movieId.toString());
    setMovieData(newMovieData);
  };

  return (
    <>
      <Cards>
        {data?.results.map((item: IMovie, index: number) => (
          <Card
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Img
              variants={imgVariants}
              whileHover="hover"
              onClick={() => onCardClicked(item.id)}
              key={index}
              bgPhoto={makeImagePath(item.backdrop_path)}
            ></Img>
            {item.title}
          </Card>
        ))}
      </Cards>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              variants={bigMovieVariants}
              initial="initial"
              animate="visible"
              exit="leaving"
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigMovieMatch.params.movieId}
            >
              {clickedMovie && (
                <>
                  <CloseIcon
                    onClick={onOverlayClick}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    width="36"
                    height="36"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    />
                  </CloseIcon>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>
                    {clickedMovie.overview}
                    <br />
                    <ul>
                      <li>Budget: {movieData?.budget}</li>
                      <li>Revenue: {movieData?.revenue}</li>
                      <li>Runtime: {movieData?.runtime}</li>
                      <li>Rating: {movieData?.vote_average}</li>
                      <li>ComingSoonpage: {movieData?.homepage}</li>
                    </ul>
                  </BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default NowPlaying;
