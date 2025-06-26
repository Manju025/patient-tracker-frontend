<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Database connection
$conn = new mysqli('localhost', 'root', 'manju9121', 'patient_tracking');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$request_method = $_SERVER['REQUEST_METHOD'];

switch($request_method) {
    case 'GET':
        // Fetch appointments
        $sql = "SELECT id, patient_name, doctor, date, time FROM appointments";
        $result = $conn->query($sql);

        if ($result) {
            $appointments = [];

            while ($row = $result->fetch_assoc()) {
                $appointments[] = $row;
            }

            echo json_encode(['success' => true, 'appointments' => $appointments]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error fetching appointments: ' . $conn->error]);
        }
        break;

    case 'POST':
        // Add, update, or delete appointment
        $input = json_decode(file_get_contents('php://input'), true);
        if(isset($input['action'])) {
            if ($input['action'] == 'delete') {
                // Delete appointment
                $id = $input['id'];
                $sql = "DELETE FROM appointments WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(['success' => true, 'message' => 'Appointment deleted successfully']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Error deleting appointment: ' . $conn->error]);
                }
            } elseif ($input['action'] == 'update') {
                // Update appointment
                $id = $input['id'];
                $patient_name = $input['patient_name'];
                $doctor = $input['doctor'];
                $date = $input['date'];
                $time = $input['time'];
                $sql = "UPDATE appointments SET patient_name='$patient_name', doctor='$doctor', date='$date', time='$time' WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(['success' => true, 'message' => 'Appointment updated successfully']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Error updating appointment: ' . $conn->error]);
                }
            }
        } else {
            // Add appointment
            $patient_name = $_POST['patientName'];
            $doctor = $_POST['doctor'];
            $date = $_POST['date'];
            $time = $_POST['time'];
            $sql = "INSERT INTO appointments (patient_name, doctor, date, time) VALUES ('$patient_name', '$doctor', '$date', '$time')";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(['success' => true, 'message' => 'Appointment added successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error adding appointment: ' . $conn->error]);
            }
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        break;
}

$conn->close();
?>
