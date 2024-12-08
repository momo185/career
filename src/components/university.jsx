import React, { useEffect, useState } from 'react';
import "../styles/uni.css";
import '../styles/scroll.css';

const University = () => {
    const [universities, setUniversities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [profile, setProfile] = useState({ name: '', email: '', phone: '', passGrades: '' });
    const [applications, setApplications] = useState([]);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showApplicationsModal, setShowApplicationsModal] = useState(false);
    const [showApplyFormModal, setShowApplyFormModal] = useState(false);

    const [newApplication, setNewApplication] = useState({
        studentName: '',
        phoneNumber: '',
        student_id: '', 
        university: '',
        course_id: '', 
        faculty: '',
        major_subject: '', 
        grades: [{ subject: '', grade: '' }]
    });

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await fetch('http://localhost:8081/universities');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setUniversities(data);
            } catch (error) {
                console.error('Error fetching universities:', error);
            }
        };
        fetchUniversities();
    }, []);

    const filteredUniversities = universities.filter(
        (university) => university.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProfileUpdate = () => {
        console.log('Updating profile:', profile);
        setShowProfileModal(false);
    };

    const handleInputChange = (field, value) => {
        setNewApplication({ ...newApplication, [field]: value });
    };

    const handleApply = async () => {
        const { studentName, phoneNumber, student_id, university, course_id, faculty, major_subject, grades } = newApplication;
    
        const payload = {
            student_name: studentName,
            phone_number: phoneNumber,
            student_id,
            university,
            course_id,
            faculty,
            major_subject,
            application_date: new Date().toISOString(), 
            subject1: grades[0]?.subject || '',
            grade1: grades[0]?.grade || '',
            subject2: grades[1]?.subject || '',
            grade2: grades[1]?.grade || '',
            subject3: grades[2]?.subject || '',
            grade3: grades[2]?.grade || '',
            subject4: grades[3]?.subject || '',
            grade4: grades[3]?.grade || '',
            subject5: grades[4]?.subject || '',
            grade5: grades[4]?.grade || '',
            subject6: grades[5]?.subject || '',
            grade6: grades[5]?.grade || '',
            subject7: grades[6]?.subject || '',
            grade7: grades[6]?.grade || '',
            subject8: grades[7]?.subject || '',
            grade8: grades[7]?.grade || ''
        };
    
        try {
            const response = await fetch('http://localhost:8081/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload), 
            });
            if (!response.ok) {
                const errorData = await response.json(); // Get error data if response is not OK
                throw new Error(`Error: ${response.status}, Message: ${errorData.message || 'Failed to submit application'}`);
            }
    
            const data = await response.json();
            setApplications([...applications, data]);
            setShowApplyFormModal(false);
            alert('Application submitted successfully!');
            setNewApplication({
                studentName: '',
                phoneNumber: '',
                student_id: '',
                university: '',
                course_id: '',
                faculty: '',
                major_subject: '',
                grades: [{ subject: '', grade: '' }]
            });
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Application submitted successfully!');
        }
    };
    

    const handleAddGrade = () => {
        setNewApplication({
            ...newApplication,
            grades: [...newApplication.grades, { subject: '', grade: '' }]
        });
    };

    return (
        <div className="universities-page">
            <h1>Student Dashboard</h1>
            <input
                type="text"
                placeholder="Search for university or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <div className="card-container">
                {filteredUniversities.length > 0 ? (
                    filteredUniversities.map((university) => (
                        <div key={university.id} className="university-card">
                            <img src={university.logo} alt={university.name} className="card-image" />
                            <h2>{university.name}</h2>
                            <p><strong>Number of Students:</strong> {university.number_of_students}</p>
                            <p><strong>Number of Departments:</strong> {university.number_of_departments}</p>
                            <p><strong>Number of Courses:</strong> {university.number_of_courses}</p>
                        </div>
                    ))
                ) : (
                    <p>No universities or courses found</p>
                )}
            </div>

            <button className="view-applications-button" onClick={() => setShowApplicationsModal(true)}>
                View Admissions
            </button>
            <button className="apply-form-button" onClick={() => setShowApplyFormModal(true)}>
                Apply for a Course
            </button>
            <button className="view-profile-button" onClick={() => setShowProfileModal(true)}>
                View/Update Profile
            </button>

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowProfileModal(false)}>&times;</span>
                        <h2>My Profile</h2>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                        <label>Phone:</label>
                        <input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                        <label>Pass Grades:</label>
                        <input
                            type="text"
                            value={profile.passGrades}
                            onChange={(e) => setProfile({ ...profile, passGrades: e.target.value })}
                        />
                        <button className="update-profile-button" onClick={handleProfileUpdate}>Update Profile</button>
                    </div>
                </div>
            )}

            {/* Admissions Modal */}
            {showApplicationsModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowApplicationsModal(false)}>&times;</span>
                        <h2>My Admissions</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>University Name</th>
                                    <th>Course</th>
                                    <th>Admission Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length > 0 ? (
                                    applications.map((admission, index) => (
                                        <tr key={index}>
                                            <td>{admission.studentName}</td>
                                            <td>{admission.university}</td>
                                            <td>{admission.course}</td>
                                            <td>{admission.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No admissions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Apply Form Modal */}
            {showApplyFormModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowApplyFormModal(false)}>&times;</span>
                        <h2>Apply for a Course</h2>
                        <form>
                            <input
                                type="text"
                                placeholder="Student Name"
                                value={newApplication.studentName}
                                onChange={(e) => handleInputChange('studentName', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={newApplication.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Student ID"
                                value={newApplication.student_id}
                                onChange={(e) => handleInputChange('student_id', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="University"
                                value={newApplication.university}
                                onChange={(e) => handleInputChange('university', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Course ID"
                                value={newApplication.course_id}
                                onChange={(e) => handleInputChange('course_id', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Faculty"
                                value={newApplication.faculty}
                                onChange={(e) => handleInputChange('faculty', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Major Subject"
                                value={newApplication.major_subject}
                                onChange={(e) => handleInputChange('major_subject', e.target.value)}
                            />
                            <h3>Grades</h3>
                            {newApplication.grades.map((grade, index) => (
                                <div key={index}>
                                    <input
                                        type="text"
                                        placeholder={`Subject ${index + 1}`}
                                        value={grade.subject}
                                        onChange={(e) => {
                                            const updatedGrades = [...newApplication.grades];
                                            updatedGrades[index].subject = e.target.value;
                                            setNewApplication({ ...newApplication, grades: updatedGrades });
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Grade"
                                        value={grade.grade}
                                        onChange={(e) => {
                                            const updatedGrades = [...newApplication.grades];
                                            updatedGrades[index].grade = e.target.value;
                                            setNewApplication({ ...newApplication, grades: updatedGrades });
                                        }}
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={handleAddGrade}>Add Another Subject</button>
                            <button type="button" className="confirm-apply-button" onClick={handleApply}>Apply</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default University;
