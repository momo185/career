import React, { useState, useEffect } from 'react';
import "../styles/admin.css";
import '../styles/modals.css';
import axios from 'axios';

const Admin = () => {
    const [showAddInstitutionModal, setShowAddInstitutionModal] = useState(false);
    const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [showDeleteInstitutionModal, setShowDeleteInstitutionModal] = useState(false);
    const [showPublishAdmissionsModal, setShowPublishAdmissionsModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const [institutionName, setInstitutionName] = useState('');
    const [facultyName, setFacultyName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [institutionToDelete, setInstitutionToDelete] = useState('');
    const [admissionDetails, setAdmissionDetails] = useState('');
    const [profileDetails, setProfileDetails] = useState({ name: '', email: '', phone: '' });
    
    const [numberOfStudents, setNumberOfStudents] = useState('');
    const [numberOfDepartments, setNumberOfDepartments] = useState('');
    const [numberOfCourses, setNumberOfCourses] = useState('');
    const [universityLogo, setUniversityLogo] = useState(null);
    
    // State for adding faculty
    const [selectedInstitution, setSelectedInstitution] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('');
    
    // Admissions data
    const [admissionsData, setAdmissionsData] = useState([
        { id: 1, institution: 'Institution A', studentName: 'John Doe', faculty: 'Faculty of Science', course: 'Physics', status: 'Admitted' },
        { id: 2, institution: 'Institution B', studentName: 'Jane Smith', faculty: 'Faculty of Arts', course: 'Literature', status: 'Pending' },
    ]);

    const [institutions, setInstitutions] = useState([]); // State for institutions
    const [faculties, setFaculties] = useState([]); // State for faculties

    useEffect(() => {
        fetchInstitutions();
        fetchFaculties();
    }, []);

    const fetchInstitutions = async () => {
        try {
            const response = await axios.get('http://localhost:8081/institutions');
            setInstitutions(response.data);
        } catch (error) {
            console.error('Error fetching institutions:', error);
        }
    };

    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://localhost:8081/faculties');
            setFaculties(response.data);
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };

    const handleAddInstitution = async () => {
        // Validate inputs before sending
        if (!institutionName || !numberOfStudents || !numberOfDepartments || !numberOfCourses || !universityLogo) {
            alert('Please fill in all fields before submitting.');
            return;
        }
    
        const formData = new FormData();
        formData.append('name', institutionName);
        formData.append('number_of_students', numberOfStudents);
        formData.append('number_of_departments', numberOfDepartments);
        formData.append('number_of_courses', numberOfCourses);
        formData.append('logo', universityLogo);
    
        try {
            const response = await fetch('http://localhost:8081/institutions', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            alert('Institution added:', data);
            fetchInstitutions();
            setShowAddInstitutionModal(false);
            setInstitutionName('');
            setNumberOfStudents('');
            setNumberOfDepartments('');
            setNumberOfCourses('');
            setUniversityLogo(null);
    
        } catch (error) {
            console.error('Error adding institution:', error);
            alert('Failed to add institution. Please try again.');
        }
    };
    
    const handleAddFaculty = async () => {
        // Verify that a faculty name and institution are selected
        if (!facultyName || !selectedInstitution) {
            alert('Please provide a faculty name and select an institution.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/faculties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: facultyName,
                    institution_id: selectedInstitution, // Make sure this matches what your backend expects
                }),
            });

            // Check if the response is OK
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                throw new Error(`Error adding faculty: ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            alert('Faculty added:', data);
            fetchFaculties();
            setShowAddFacultyModal(false);
            setFacultyName('');
            setSelectedInstitution('');
        } catch (error) {
            console.error('Error adding faculty:', error);
            alert('Failed to add faculty. Please try again.');
        }
    };
    
    const handleAddCourse = async () => {
        try {
            const response = await fetch('http://localhost:8081/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: courseName,
                    faculty: selectedFaculty,
                    institution: selectedInstitution,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            alert('Course added:', data);

            // Reset state after successful addition
            setShowAddCourseModal(false);
            setCourseName('');
            setSelectedInstitution('');
            setSelectedFaculty('');
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Failed to add course. Please try again.');
        }
    };

    const handleDeleteInstitution = async (institutionId) => {
        if (window.confirm("Are you sure you want to delete this institution? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:8081/institutions/${institutionId}`);
                alert('Institution deleted:', institutionId);
                fetchInstitutions();
                setShowDeleteInstitutionModal(false);
            } catch (error) {
                console.error('Error deleting institution:', error);
                alert('Failed to delete institution. Please try again.');
            }
        }
    };

    const handlePublishAdmissions = () => {
        alert('Admissions published successfully');
        setShowPublishAdmissionsModal(false);
    };

    const handleProfileUpdate = () => {
        console.log('Profile updated successfully');
        setShowProfileModal(false);
    };

    return (
        <div className="admin-page">
            <h1>Admin Panel</h1>
            <div className="admin-buttons">
                <div className="button-container">
                    <button className="admin-button" onClick={() => setShowAddInstitutionModal(true)}>Add Institution</button>
                    <button className="admin-button" onClick={() => setShowAddFacultyModal(true)}>Add Faculty</button>
                    <button className="admin-button" onClick={() => setShowAddCourseModal(true)}>Add Course</button>
                    <button className="admin-button" onClick={() => setShowDeleteInstitutionModal(true)}>Delete Institution</button>
                    <button className="admin-button" onClick={() => setShowPublishAdmissionsModal(true)}>Publish Admissions</button>
                    <button className="admin-button" onClick={() => setShowProfileModal(true)}>Profile</button>
                </div>
            </div>

            {/* Modal for Adding Institution */}
            {showAddInstitutionModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowAddInstitutionModal(false)}>×</span>
                        <h2>Add High Learning Institution</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddInstitution(); }}>
                            <input
                                type="text"
                                value={institutionName}
                                onChange={(e) => setInstitutionName(e.target.value)}
                                placeholder="Institution Name"
                                required
                            />
                            <input
                                type="number"
                                value={numberOfStudents}
                                onChange={(e) => setNumberOfStudents(e.target.value)}
                                placeholder="Number of Students"
                                required
                            />
                            <input
                                type="number"
                                value={numberOfDepartments}
                                onChange={(e) => setNumberOfDepartments(e.target.value)}
                                placeholder="Number of Departments"
                                required
                            />
                            <input
                                type="number"
                                value={numberOfCourses}
                                onChange={(e) => setNumberOfCourses(e.target.value)}
                                placeholder="Number of Courses"
                                required
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setUniversityLogo(e.target.files[0]);
                                    }
                                }}
                                required
                            />

                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Adding Faculty */}
            {showAddFacultyModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowAddFacultyModal(false)}>×</span>
                        <h2>Add Faculty</h2>
                        <input
                            type="text"
                            value={facultyName}
                            onChange={(e) => setFacultyName(e.target.value)}
                            placeholder="Faculty Name"
                            required
                        />
                        <select
                            value={selectedInstitution}
                            onChange={(e) => setSelectedInstitution(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Institution</option>
                            {institutions.map((institution) => (
                                <option key={institution.id} value={institution.id}> {/* Make sure this is the institution ID */}
                                    {institution.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleAddFaculty}>Submit</button>
                    </div>
                </div>
            )}

            {/* Modal for Adding Course */}
            {showAddCourseModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowAddCourseModal(false)}>×</span>
                        <h2>Add Course</h2>
                        <input
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            placeholder="Course Name"
                            required
                        />
                        <select
                            value={selectedInstitution}
                            onChange={(e) => {
                                setSelectedInstitution(e.target.value);
                                setSelectedFaculty(''); // Reset faculty when institution changes
                            }}
                            required
                        >
                            <option value="" disabled>Select Institution</option>
                            {institutions.map((institution) => (
                                <option key={institution.id} value={institution.id}> {/* Use institution ID */}
                                    {institution.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedFaculty}
                            onChange={(e) => setSelectedFaculty(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Faculty</option>
                            {faculties
                                .filter(faculty => faculty.institution_id === selectedInstitution) // Filter faculties by institution ID
                                .map((faculty) => (
                                    <option key={faculty.id} value={faculty.id}> {/* Use faculty ID */}
                                        {faculty.name}
                                    </option>
                            ))}
                        </select>
                        <button onClick={handleAddCourse}>Submit</button>
                    </div>
                </div>
            )}

            {/* Modal for Deleting Institution */}
            {showDeleteInstitutionModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowDeleteInstitutionModal(false)}>×</span>
                        <h2>Delete Institution</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Institution Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {institutions.map((institution) => (
                                    <tr key={institution.id}>
                                        <td>{institution.name}</td>
                                        <td>
                                            <button onClick={() => handleDeleteInstitution(institution.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal for Publishing Admissions */}
            {showPublishAdmissionsModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowPublishAdmissionsModal(false)}>×</span>
                        <h2>Publish Admissions</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Institution</th>
                                    <th>Name of Student</th>
                                    <th>Faculty</th>
                                    <th>Course Admitted</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admissionsData.map((admission) => (
                                    <tr key={admission.id}>
                                        <td>{admission.institution}</td>
                                        <td>{admission.studentName}</td>
                                        <td>{admission.faculty}</td>
                                        <td>{admission.course}</td>
                                        <td>{admission.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handlePublishAdmissions}>Publish Admissions</button>
                    </div>
                </div>
            )}

            {/* Modal for Admin Profile */}
            {showProfileModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowProfileModal(false)}>×</span>
                        <h2>Admin Profile</h2>
                        <input
                            type="text"
                            value={profileDetails.name}
                            onChange={(e) => setProfileDetails({ ...profileDetails, name: e.target.value })}
                            placeholder="Name"
                            required
                        />
                        <input
                            type="email"
                            value={profileDetails.email}
                            onChange={(e) => setProfileDetails({ ...profileDetails, email: e.target.value })}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="text"
                            value={profileDetails.phone}
                            onChange={(e) => setProfileDetails({ ...profileDetails, phone: e.target.value })}
                            placeholder="Phone Number"
                            required
                        />
                        <button onClick={handleProfileUpdate}>Update Profile</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;