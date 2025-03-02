import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { EventBusProvider } from "./EventBus.jsx";
import { BrowserRouter } from "react-router-dom";
import StoreProvider from "./pages/State/Redux.jsx";
import global from 'global';
global.global = global;

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<EventBusProvider>
				<StoreProvider>
					<App />
				</StoreProvider>
			</EventBusProvider>
		</BrowserRouter>
	</StrictMode>
);
