import { GameContextProvider } from "context/game.context";
import Home from "components/Home";

function App() {
  return (
    <GameContextProvider>
      <Home />
    </GameContextProvider>
  );
}

export default App;
