import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import ComingSoon from "./Routes/ComingSoon";
import NowPlaying from "./Routes/NowPlaying";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path={["/comingSoon", "/comingSoon/movies/:movieId"]}>
          <ComingSoon />
        </Route>
        <Route path={["/nowPlaying", "/nowPlaying/movies/:movieId"]}>
          <NowPlaying />
        </Route>
        <Route path={["/", "/movies/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
