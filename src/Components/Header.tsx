import { Link, useRouteMatch, useHistory } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const Circle = styled(motion.div)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.red};
`;

function Header() {
  const homeMatch = useRouteMatch("/");
  const comingSoonMatch = useRouteMatch("/comingSoon");
  const nowPlayingMatch = useRouteMatch("/nowPlaying");

  return (
    <Wrapper>
      <Item>
        <Link to="/">
          <Label>POPULAR</Label>
        </Link>
        {homeMatch?.isExact && <Circle layoutId="circle" />}
      </Item>
      <Item>
        <Link to="/comingSoon">
          <Label>COMING SOON</Label>
        </Link>
        {comingSoonMatch && <Circle layoutId="circle" />}
      </Item>
      <Item>
        <Link to="/nowPlaying">
          <Label>NOW PLAYING</Label>
        </Link>
        {nowPlayingMatch && <Circle layoutId="circle" />}
      </Item>
    </Wrapper>
  );
}

export default Header;
