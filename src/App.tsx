import { DoctorAvailability } from "./components/DoctorAvailability";
import { DoctorCalendar } from "./components/DoctorCalendar";
import { TestFirebase  } from "./components/TestFirebase";

function App() {
    return (
    <div>
        <h1> Konsultacje lekarskie.</h1>
        <TestFirebase />
        <DoctorCalendar />
        <DoctorAvailability />
    </div>
    );
}

export default App;
