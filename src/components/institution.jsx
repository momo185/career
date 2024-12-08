import React, { useState, useEffect } from 'react';
import "../styles/admin.css"; 

const Institution = () => {
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showViewApplicationsModal, setShowViewApplicationsModal] = useState(false);
  const [showPublishAdmissionsModal, setShowPublishAdmissionsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [facultyName, setFacultyName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [applicationList, setApplicationList] = useState([]);
  const [profileDetails, setProfileDetails] = useState({
    name: 'Limkokwing University of Creative Technology',
    email: 'luct@info.ac.ls',
    phone: '123-456-7890',
    profilePicture: 'https://via.placeholder.com/150', 
  });

  const [faculties, setFaculties] = useState([]); 
  const [courses, setCourses] = useState([]); 
  const [profilePicturePreview, setProfilePicturePreview] = useState(profileDetails.profilePicture);

  // Fetch faculties from the database
  const fetchFaculties = async () => {
    try {
      const response = await fetch('http://localhost:8081/faculties');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFaculties(data); 
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []); 

  const handleViewApplications = () => {
    setApplicationList(dummyApplications); 
    setShowViewApplicationsModal(true);
  };

  const handleAddFaculty = async () => {
    try {
      const response = await fetch('http://localhost:8081/faculties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: facultyName,
          institution_id: '1', 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert('Faculty added:', data);
      fetchFaculties(); 
      setShowAddFacultyModal(false);
      setFacultyName(''); 
    } catch (error) {
      console.error('Error adding faculty:', error);
      alert('Failed to add faculty. Please try again.');
    }
  };
  const dummyApplications = [
    {
      id: 1,
      studentName: 'Thabo Lebese',
      courseName: 'Computer Science',
      subject1: 'Mathematics',
      subject2: 'Physics',
      subject3: 'Chemistry',
      subject4: 'Biology',
      subject5: 'English',
    },
    
  ];
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
          institution: '3',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert('Course added:', data);
      
      setCourses([...courses, data]); 
      
      setShowAddCourseModal(false); 
      setCourseName(''); 
      setSelectedFaculty('');
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course. Please try again.');
    }
  };

  const handleProfileUpdate = async () => {
    const { name, email, phone } = profileDetails;
    if (!name || !email || !phone) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileDetails),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Profile updated:', await response.json());
      setShowProfileModal(false);
      setConfirmationMessage('Profile updated successfully.');
      setShowConfirmationModal(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // New functions for handling application acceptance/rejection
  const handleAcceptApplication = (appId) => {
    setApplicationList(applicationList.filter(app => app.id !== appId));
    alert(`Accepted application from ${applicationList.find(app => app.id === appId).studentName}`);
  };

  const handleRejectApplication = (appId) => {
    setApplicationList(applicationList.filter(app => app.id !== appId));
    alert(`Rejected application from ${applicationList.find(app => app.id === appId).studentName}`);
  };

  return (
    <div className="admin-page">
      <h1>Institution Panel</h1>
      <div className="admin-buttons">
        <div className="button-container">
          <button className="admin-button" onClick={() => setShowAddFacultyModal(true)}>Add Faculty</button>
          <button className="admin-button" onClick={() => setShowAddCourseModal(true)}>Add Course</button>
          <button className="admin-button" onClick={handleViewApplications}>View Applications</button>
          <button className="admin-button" onClick={() => setShowPublishAdmissionsModal(true)}>Publish Admissions</button>
          <button className="admin-button" onClick={() => setShowProfileModal(true)}>Profile</button>
        </div>
      </div>

      {/* Modal for Adding Faculty */}
      {showAddFacultyModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddFacultyModal(false)}>&times;</span>
            <h2>Add Faculty</h2>
            <input
              type="text"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              placeholder="Faculty Name"
              required
            />
            <button onClick={handleAddFaculty}>Submit</button>
          </div>
        </div>
      )}

      {/* Modal for Adding Course */}
      {showAddCourseModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddCourseModal(false)}>&times;</span>
            <h2>Add Course</h2>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Course Name"
              required
            />        
            <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}>
              <option value="" disabled>Select Faculty</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
              ))}
            </select>
 
            <button onClick={handleAddCourse}>Submit</button>
          </div>
        </div>        
      )}

      {/* Modal for Viewing Applications */}
      {showViewApplicationsModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowViewApplicationsModal(false)}>&times;</span>
            <h2>Applications</h2>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Subject 1</th>
                  <th>Subject 2</th>
                  <th>Subject 3</th>
                  <th>Subject 4</th>
                  <th>Subject 5</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicationList.length === 0 ? (
                  <tr><td colSpan="8">No applications found.</td></tr>
                ) : (
                  applicationList.map(app => (
                    <tr key={app.id}>
                      <td>{app.studentName}</td>
                      <td>{app.courseName}</td>
                      <td>{app.subject1}</td>
                      <td>{app.subject2}</td>
                      <td>{app.subject3}</td>
                      <td>{app.subject4}</td>
                      <td>{app.subject5}</td>
                      <td>
                        <button onClick={() => handleAcceptApplication(app.id)}>Accept</button>
                        <button onClick={() => handleRejectApplication(app.id)}>Reject</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Profile */}
      {showProfileModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowProfileModal(false)}>&times;</span>
            <h2>Profile</h2>
            <img src={profilePicturePreview} alt="Profile" />
            <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
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
              type="tel"
              value={profileDetails.phone}
              onChange={(e) => setProfileDetails({ ...profileDetails, phone: e.target.value })}
              placeholder="Phone"
              required
            />
            <button onClick={handleProfileUpdate}>Update Profile</button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowConfirmationModal(false)}>&times;</span>
            <h2>{confirmationMessage}</h2>
            <button onClick={() => setShowConfirmationModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for Publishing Admissions */}
      {showPublishAdmissionsModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowPublishAdmissionsModal(false)}>&times;</span>
            <h2>Publish Admissions</h2>
            {/* Add your publish admissions logic here */}
            <button onClick={() => alert('Admissions published!')}>Publish</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Institution;
