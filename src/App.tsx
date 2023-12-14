import { Button, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import "./App.css";
import { useMainStore } from "./stores/useMainStore";
import { theme } from "./theme";

function App() {
  const { count, increaseCount } = useMainStore();

  return (
    <MantineProvider theme={theme}>
      <Button onClick={increaseCount}>Increase</Button>
      <p>{count}</p>
    </MantineProvider>
  );
}

export default App;
