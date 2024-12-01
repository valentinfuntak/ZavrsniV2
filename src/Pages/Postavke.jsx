import { createSignal } from "solid-js";
import Plane from "../assets/planefav.png";

function Postavke(props) {
    const [isDarkMode, setIsDarkMode] = createSignal(true); 

    const [isNotificationsEnabled, setIsNotificationsEnabled] = createSignal(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode());
        if (!isDarkMode()) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const toggleNotifications = () => {
        setIsNotificationsEnabled(!isNotificationsEnabled());
    };

    return (
        <div class={`min-h-screen ${isDarkMode() ? "dark:bg-gray-900" : "bg-white"} transition-all`}>
            <div class="max-w-screen-lg mx-auto p-6">
                <h1 class="font-mono text-4xl mb-3">POSTAVKE</h1>
                <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <h2 class="text-xl font-medium text-gray-900 dark:text-white mb-4">Postavke teme</h2>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-900 dark:text-white">Tamna tema</span>
                        <label htmlFor="themeToggle" class="inline-flex relative items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="themeToggle"
                                checked={isDarkMode()}
                                onChange={toggleTheme}
                                class="sr-only"
                            />
                            <div class="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                            <span
                                class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 transform"
                                classList={{
                                    "translate-x-5": isDarkMode(),
                                }}
                            ></span>
                        </label>
                    </div>
                </div>
                <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-3">
                    <h2 class="text-xl font-medium text-gray-900 dark:text-white mb-4">Ostale postavke</h2>
                    <form>
                        <div class="mb-4">
                            <label htmlFor="language" class="block text-gray-900 dark:text-white mb-2">Jezik</label>
                            <select id="language" class="w-full p-2 bg-gray-200 dark:bg-gray-600 rounded-md text-gray-900 dark:text-white">
                                <option value="hrvatski">Hrvatski</option>
                                <option value="engleski">Engleski</option>
                                <option value="njemački">Njemački</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label htmlFor="notifications" class="block text-gray-900 dark:text-white mb-2">Obavijesti</label>
                            <label htmlFor="notificationsToggle" class="inline-flex relative items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="notificationsToggle"
                                    checked={isNotificationsEnabled()}
                                    onChange={toggleNotifications}
                                    class="sr-only"
                                />
                                <div class="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                                <span
                                    class={`absolute left-1 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 transform ${isNotificationsEnabled() ? "translate-x-5" : ""}`}
                                ></span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            class="w-full p-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            Spremi postavke
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Postavke;
