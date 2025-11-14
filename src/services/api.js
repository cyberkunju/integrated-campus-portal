// API Configuration
const API_BASE_URL = 'http://localhost/studentportal-api/api';

// API Service for Student Portal
class ApiService {
  // Authentication
  async login(username, password, role) {
    // MOCK LOGIN - Remove this when backend is ready
    // Mock user database with proper role validation
    const mockUsers = {
      // Admin users
      'admin': { password: '123', role: 'admin', full_name: 'Admin User', department: 'Administration' },
      
      // Staff/Teacher users
      'teacher': { password: '123', role: 'staff', full_name: 'Teacher User', department: 'BCA' },
      'rajesh.kumar': { password: '123', role: 'staff', full_name: 'Rajesh Kumar', department: 'BCA' },
      'priya.sharma': { password: '123', role: 'staff', full_name: 'Priya Sharma', department: 'BBA' },
      
      // Student users
      'student': { password: '123', role: 'student', full_name: 'Student User', department: 'BCA', semester: '5' },
      'karthika': { password: '123', role: 'student', full_name: 'Karthika', department: 'BCA', semester: '5' },
      'aarav.sharma': { password: '123', role: 'student', full_name: 'Aarav Sharma', department: 'BCA', semester: '1' },
      'diya.patel': { password: '123', role: 'student', full_name: 'Diya Patel', department: 'BBA', semester: '3' },
      'rahul.verma': { password: '123', role: 'student', full_name: 'Rahul Verma', department: 'B.Com', semester: '5' },
      'priya.singh': { password: '123', role: 'student', full_name: 'Priya Singh', department: 'B.Com', semester: '3' }
    };
    
    // Check if user exists
    const user = mockUsers[username.toLowerCase()];
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // Check password
    if (user.password !== password) {
      return { success: false, message: 'Invalid password' };
    }
    
    // Check if role matches
    if (user.role !== role) {
      return { success: false, message: `This user is not a ${role}. Please select the correct role.` };
    }
    
    // Create user session
    const mockUser = {
      username: username,
      full_name: user.full_name,
      email: `${username}@university.edu`,
      role: user.role,
      student_id: user.role === 'student' ? 'S2024001' : null,
      teacher_id: user.role === 'staff' ? 'T2024001' : null,
      department: user.department,
      semester: user.semester || null
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
    
    /* REAL API CODE - Uncomment when backend is ready
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await response.json();
      
      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
    */
  }

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Logout
  logout() {
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  // Dashboard Stats
  async getDashboardStats(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/get_stats.php?student_id=${studentId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return { success: false, message: 'Failed to fetch dashboard stats' };
    }
  }

  // Get Subjects
  async getSubjects(studentId) {
    // MOCK DATA - Returns subjects based on user's department and semester
    const user = this.getCurrentUser();
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Subject database organized by department and semester
    const subjectDatabase = {
      'BCA': {
        1: [
          { subject_code: 'BCA101', subject_name: 'Programming Fundamentals', teacher_name: 'Dr. Rajesh Kumar', credits: 4 },
          { subject_code: 'BCA102', subject_name: 'Digital Electronics', teacher_name: 'Prof. Priya Sharma', credits: 3 },
          { subject_code: 'BCA103', subject_name: 'Mathematics I', teacher_name: 'Dr. Amit Verma', credits: 4 },
          { subject_code: 'BCA104', subject_name: 'English Communication', teacher_name: 'Ms. Sneha Patel', credits: 2 },
          { subject_code: 'BCA105', subject_name: 'Computer Organization', teacher_name: 'Dr. Vikram Singh', credits: 3 }
        ],
        3: [
          { subject_code: 'BCA301', subject_name: 'Data Structures', teacher_name: 'Dr. Rajesh Kumar', credits: 4 },
          { subject_code: 'BCA302', subject_name: 'Database Management Systems', teacher_name: 'Prof. Priya Sharma', credits: 4 },
          { subject_code: 'BCA303', subject_name: 'Operating Systems', teacher_name: 'Dr. Amit Verma', credits: 3 },
          { subject_code: 'BCA304', subject_name: 'Web Technologies', teacher_name: 'Ms. Kavya Reddy', credits: 3 },
          { subject_code: 'BCA305', subject_name: 'Software Engineering', teacher_name: 'Dr. Vikram Singh', credits: 3 }
        ],
        5: [
          { subject_code: 'BCA501', subject_name: 'Computer Networks', teacher_name: 'Prof. Priya Sharma', credits: 4 },
          { subject_code: 'BCA502', subject_name: 'IT and Environment', teacher_name: 'Dr. Amit Verma', credits: 3 },
          { subject_code: 'BCA503', subject_name: 'Java Programming Using Linux', teacher_name: 'Dr. Rajesh Kumar', credits: 4 },
          { subject_code: 'BCA504', subject_name: 'Open Course', teacher_name: 'Dr. Arun Verma', credits: 4 },
          { subject_code: 'BCA505', subject_name: 'Mini Project', teacher_name: 'Ms. Kavya Reddy', credits: 3 },
          { subject_code: 'BCA506', subject_name: 'Software Lab V', teacher_name: 'Prof. Suresh Nair', credits: 2 }
        ],
        7: [
          { subject_code: 'BCA701', subject_name: 'Artificial Intelligence', teacher_name: 'Dr. Rajesh Kumar', credits: 4 },
          { subject_code: 'BCA702', subject_name: 'Cyber Security', teacher_name: 'Prof. Priya Sharma', credits: 4 },
          { subject_code: 'BCA703', subject_name: 'Big Data Analytics', teacher_name: 'Dr. Amit Verma', credits: 3 },
          { subject_code: 'BCA704', subject_name: 'Project Work', teacher_name: 'Dr. Vikram Singh', credits: 6 }
        ]
      },
      'BBA': {
        1: [
          { subject_code: 'BBA101', subject_name: 'Business Accounting', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'BBA102', subject_name: 'Fundamentals of Business Mathematics', teacher_name: 'Prof. Ramesh Iyer', credits: 4 },
          { subject_code: 'BBA103', subject_name: 'Principles and Methodology of Management', teacher_name: 'Dr. Suresh Malhotra', credits: 4 },
          { subject_code: 'BBA104', subject_name: 'Fundamentals of Business Statistics', teacher_name: 'Ms. Anjali Gupta', credits: 3 },
          { subject_code: 'BBA105', subject_name: 'Global Business Environment', teacher_name: 'Prof. Karan Mehta', credits: 3 }
        ],
        2: [
          { subject_code: 'BBA201', subject_name: 'Business Communication', teacher_name: 'Ms. Anjali Gupta', credits: 3 },
          { subject_code: 'BBA202', subject_name: 'Cost and Management Accounting', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'BBA203', subject_name: 'Mathematics for Management', teacher_name: 'Prof. Ramesh Iyer', credits: 4 },
          { subject_code: 'BBA204', subject_name: 'Statistics for Management', teacher_name: 'Ms. Anjali Gupta', credits: 3 },
          { subject_code: 'BBA205', subject_name: 'English - Issues That Matter', teacher_name: 'Prof. Sneha Patel', credits: 2 }
        ],
        3: [
          { subject_code: 'BBA301', subject_name: 'Business Laws', teacher_name: 'Prof. Ramesh Iyer', credits: 3 },
          { subject_code: 'BBA302', subject_name: 'Human Resource Management', teacher_name: 'Ms. Anjali Gupta', credits: 4 },
          { subject_code: 'BBA303', subject_name: 'Marketing Management', teacher_name: 'Dr. Suresh Malhotra', credits: 4 },
          { subject_code: 'BBA304', subject_name: 'Research Methodology', teacher_name: 'Prof. Karan Mehta', credits: 3 },
          { subject_code: 'BBA305', subject_name: 'Corporate Accounting', teacher_name: 'Dr. Meera Nair', credits: 4 }
        ],
        4: [
          { subject_code: 'BBA401', subject_name: 'Basic Informatics for Management', teacher_name: 'Dr. Rajesh Kumar', credits: 3 },
          { subject_code: 'BBA402', subject_name: 'Corporate Law', teacher_name: 'Prof. Ramesh Iyer', credits: 3 },
          { subject_code: 'BBA403', subject_name: 'Financial Management', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'BBA404', subject_name: 'Managerial Economics', teacher_name: 'Prof. Karan Mehta', credits: 4 },
          { subject_code: 'BBA405', subject_name: 'Entrepreneurship', teacher_name: 'Dr. Suresh Malhotra', credits: 3 },
          { subject_code: 'BBA406', subject_name: 'English - Evolution of the Philosophy of Science', teacher_name: 'Prof. Sneha Patel', credits: 2 }
        ],
        5: [
          { subject_code: 'BBA501', subject_name: 'Industrial Relations', teacher_name: 'Ms. Anjali Gupta', credits: 3 },
          { subject_code: 'BBA502', subject_name: 'Intellectual Property Rights and Industrial Laws', teacher_name: 'Prof. Ramesh Iyer', credits: 3 },
          { subject_code: 'BBA503', subject_name: 'Operations Management', teacher_name: 'Dr. Suresh Malhotra', credits: 4 },
          { subject_code: 'BBA504', subject_name: 'Environment Science and Human Rights', teacher_name: 'Prof. Karan Mehta', credits: 2 },
          { subject_code: 'BBA505', subject_name: 'Capital Market and Investment Management', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'BBA506', subject_name: 'Organisational Behaviour', teacher_name: 'Ms. Anjali Gupta', credits: 3 }
        ],
        6: [
          { subject_code: 'BBA601', subject_name: 'Advertising and Salesmanship', teacher_name: 'Dr. Suresh Malhotra', credits: 3 },
          { subject_code: 'BBA602', subject_name: 'Communication Skills and Personality Development', teacher_name: 'Ms. Anjali Gupta', credits: 3 },
          { subject_code: 'BBA603', subject_name: 'Investment and Insurance Management', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'BBA604', subject_name: 'Strategic Management', teacher_name: 'Dr. Suresh Malhotra', credits: 4 },
          { subject_code: 'BBA605', subject_name: 'Banking and Insurance Management', teacher_name: 'Prof. Karan Mehta', credits: 3 },
          { subject_code: 'BBA606', subject_name: 'Income Tax Theory, Law, and Practice', teacher_name: 'Prof. Ramesh Iyer', credits: 3 },
          { subject_code: 'BBA607', subject_name: 'Production Management', teacher_name: 'Dr. Suresh Malhotra', credits: 3 }
        ]
      },
      'B.Com': {
        1: [
          { subject_code: 'COM101', subject_name: 'Corporate Regulations and Administration', teacher_name: 'Prof. Ramesh Iyer', credits: 3 },
          { subject_code: 'COM102', subject_name: 'Dimensions and Methodology of Business Studies', teacher_name: 'Dr. Suresh Malhotra', credits: 3 },
          { subject_code: 'COM103', subject_name: 'Financial Accounting 1', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'COM104', subject_name: 'Banking and Insurance', teacher_name: 'Prof. Karan Mehta', credits: 3 },
          { subject_code: 'COM105', subject_name: 'English - Communication Skills', teacher_name: 'Prof. Sneha Patel', credits: 2 }
        ],
        2: [
          { subject_code: 'COM201', subject_name: 'Business Management', teacher_name: 'Dr. Suresh Malhotra', credits: 4 },
          { subject_code: 'COM202', subject_name: 'Business Regulatory Framework', teacher_name: 'Prof. Ramesh Iyer', credits: 3 },
          { subject_code: 'COM203', subject_name: 'Financial Accounting 2', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'COM204', subject_name: 'Principles of Business Decisions', teacher_name: 'Prof. Karan Mehta', credits: 3 },
          { subject_code: 'COM205', subject_name: 'Quantitative Techniques for Business Research', teacher_name: 'Ms. Anjali Gupta', credits: 3 },
          { subject_code: 'COM206', subject_name: 'English - Issues That Matter', teacher_name: 'Prof. Sneha Patel', credits: 2 }
        ],
        3: [
          { subject_code: 'COM301', subject_name: 'Corporate Accounting 1', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'COM302', subject_name: 'Financial Markets and Operations', teacher_name: 'Prof. Karan Mehta', credits: 4 },
          { subject_code: 'COM303', subject_name: 'Marketing Management', teacher_name: 'Dr. Suresh Malhotra', credits: 3 },
          { subject_code: 'COM304', subject_name: 'Quantitative Techniques for Business 1', teacher_name: 'Ms. Anjali Gupta', credits: 3 },
          { subject_code: 'COM305', subject_name: 'Goods and Services Tax', teacher_name: 'Prof. Ramesh Iyer', credits: 3 },
          { subject_code: 'COM306', subject_name: 'English - Literature and Identity', teacher_name: 'Prof. Sneha Patel', credits: 2 }
        ],
        4: [
          { subject_code: 'COM401', subject_name: 'Corporate Accounting 2', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'COM402', subject_name: 'Entrepreneurship Development and Project Management', teacher_name: 'Dr. Suresh Malhotra', credits: 4 },
          { subject_code: 'COM403', subject_name: 'Financial Services', teacher_name: 'Prof. Karan Mehta', credits: 3 },
          { subject_code: 'COM404', subject_name: 'Quantitative Techniques for Business 2', teacher_name: 'Ms. Anjali Gupta', credits: 3 },
          { subject_code: 'COM405', subject_name: 'Information Technology for Office', teacher_name: 'Dr. Rajesh Kumar', credits: 3 },
          { subject_code: 'COM406', subject_name: 'English - Illuminations', teacher_name: 'Prof. Sneha Patel', credits: 2 }
        ],
        5: [
          { subject_code: 'COM501', subject_name: 'Cost Accounting 1', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'COM502', subject_name: 'Brand Management', teacher_name: 'Dr. Suresh Malhotra', credits: 3 },
          { subject_code: 'COM503', subject_name: 'Computer Fundamentals, Internet, and MS Office', teacher_name: 'Dr. Rajesh Kumar', credits: 3 },
          { subject_code: 'COM504', subject_name: 'E-Commerce', teacher_name: 'Prof. Karan Mehta', credits: 3 },
          { subject_code: 'COM505', subject_name: 'Environment Management and Human Rights', teacher_name: 'Ms. Anjali Gupta', credits: 2 },
          { subject_code: 'COM506', subject_name: 'Programming in C Theory', teacher_name: 'Dr. Rajesh Kumar', credits: 3 }
        ],
        6: [
          { subject_code: 'COM601', subject_name: 'Cost Accounting 2', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'COM602', subject_name: 'Management Accounting', teacher_name: 'Prof. Ramesh Iyer', credits: 4 },
          { subject_code: 'COM603', subject_name: 'Advertisement and Sales Management', teacher_name: 'Dr. Suresh Malhotra', credits: 3 },
          { subject_code: 'COM604', subject_name: 'Auditing and Assurance', teacher_name: 'Dr. Meera Nair', credits: 4 },
          { subject_code: 'COM605', subject_name: 'Income Tax 2', teacher_name: 'Prof. Ramesh Iyer', credits: 3 },
          { subject_code: 'COM606', subject_name: 'International Marketing', teacher_name: 'Prof. Karan Mehta', credits: 3 }
        ]
      },
      'BSc Physics': {
        1: [
          { subject_code: 'PHY101', subject_name: 'Mechanics', teacher_name: 'Dr. Arun Verma', credits: 4 },
          { subject_code: 'PHY102', subject_name: 'Mathematical Physics I', teacher_name: 'Prof. Ramesh Iyer', credits: 4 },
          { subject_code: 'PHY103', subject_name: 'Chemistry', teacher_name: 'Dr. Priya Sharma', credits: 3 },
          { subject_code: 'PHY104', subject_name: 'Physics Lab I', teacher_name: 'Dr. Arun Verma', credits: 2 },
          { subject_code: 'PHY105', subject_name: 'Environmental Science', teacher_name: 'Ms. Kavya Reddy', credits: 2 }
        ],
        3: [
          { subject_code: 'PHY301', subject_name: 'Quantum Mechanics', teacher_name: 'Dr. Arun Verma', credits: 4 },
          { subject_code: 'PHY302', subject_name: 'Thermodynamics', teacher_name: 'Prof. Ramesh Iyer', credits: 4 },
          { subject_code: 'PHY303', subject_name: 'Electronics', teacher_name: 'Dr. Vikram Singh', credits: 4 },
          { subject_code: 'PHY304', subject_name: 'Mathematical Physics II', teacher_name: 'Prof. Amit Verma', credits: 3 },
          { subject_code: 'PHY305', subject_name: 'Physics Lab II', teacher_name: 'Dr. Arun Verma', credits: 2 }
        ],
        5: [
          { subject_code: 'PHY501', subject_name: 'Solid State Physics', teacher_name: 'Dr. Arun Verma', credits: 4 },
          { subject_code: 'PHY502', subject_name: 'Nuclear Physics', teacher_name: 'Prof. Ramesh Iyer', credits: 4 },
          { subject_code: 'PHY503', subject_name: 'Electromagnetic Theory', teacher_name: 'Dr. Vikram Singh', credits: 4 },
          { subject_code: 'PHY504', subject_name: 'Computational Physics', teacher_name: 'Dr. Rajesh Kumar', credits: 3 },
          { subject_code: 'PHY505', subject_name: 'Advanced Physics Lab', teacher_name: 'Dr. Arun Verma', credits: 2 }
        ]
      }
    };

    // Get subjects based on user's department and semester
    const department = user.department;
    const semester = parseInt(user.semester) || 1;
    
    const subjects = subjectDatabase[department]?.[semester] || [];
    
    return { 
      success: true, 
      data: subjects,
      message: subjects.length > 0 ? 'Subjects loaded successfully' : 'No subjects found for this semester'
    };
    
    /* REAL API CODE - Uncomment when backend is ready
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/get_all.php?student_id=${studentId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Subjects error:', error);
      return { success: false, message: 'Failed to fetch subjects' };
    }
    */
  }

  // Get Results
  async getResults(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/results/get_all.php?student_id=${studentId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Results error:', error);
      return { success: false, message: 'Failed to fetch results' };
    }
  }

  // Get Payments
  async getPayments(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/get_all.php?student_id=${studentId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payments error:', error);
      return { success: false, message: 'Failed to fetch payments' };
    }
  }

  // Process Payment
  async processPayment(paymentId, paymentMethod) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/process.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          payment_id: paymentId, 
          payment_method: paymentMethod 
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false, message: 'Failed to process payment' };
    }
  }

  // Get Notices
  async getNotices() {
    // MOCK DATA - Remove when backend is ready
    const mockNotices = JSON.parse(localStorage.getItem('notices') || '[]');
    return { success: true, data: mockNotices };
    
    /* REAL API CODE - Uncomment when backend is ready
    try {
      const response = await fetch(`${API_BASE_URL}/notices/get_all.php`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Notices error:', error);
      return { success: false, message: 'Failed to fetch notices' };
    }
    */
  }

  // Admin - Get All Students
  async getStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/get_students.php`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get students error:', error);
      return { success: false, message: 'Failed to fetch students' };
    }
  }

  // Admin - Add Student
  async addStudent(studentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/add_student.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Add student error:', error);
      return { success: false, message: 'Failed to add student' };
    }
  }

  // Admin - Update Student
  async updateStudent(studentId, studentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/update_student.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...studentData, student_id: studentId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update student error:', error);
      return { success: false, message: 'Failed to update student' };
    }
  }

  // Admin - Delete Student
  async deleteStudent(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/delete_student.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete student error:', error);
      return { success: false, message: 'Failed to delete student' };
    }
  }

  // Admin - Get All Teachers
  async getTeachers() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/get_teachers.php`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get teachers error:', error);
      return { success: false, message: 'Failed to fetch teachers' };
    }
  }

  // Admin - Add Teacher
  async addTeacher(teacherData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/add_teacher.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Add teacher error:', error);
      return { success: false, message: 'Failed to add teacher' };
    }
  }

  // Upload Image
  async uploadImage(file) {
    try {
      console.log('Uploading file:', file);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/upload/upload_image.php`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Upload failed' };
      }
      
      return data;
    } catch (error) {
      console.error('Upload image error:', error);
      return { success: false, error: 'Failed to upload image: ' + error.message };
    }
  }
}

export default new ApiService();
