// Necessary Imports (you will need to use this)
const { Student } = require('./Student')
const fs = require('fs');
/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    // TODO
    const node = new Node(newStudent);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    // TODO
    if (!this.head) return;
    
    if (this.head.data.getEmail() === email) {
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      this.length--;
      return;
    }
    
    let current = this.head;
    while (current.next && current.next.data.getEmail() !== email) {
      current = current.next;
    }
    
    if (current.next) {
      if (current.next === this.tail) this.tail = current;
      current.next = current.next.next;
      this.length--;
    }    
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    // TODO
    email = email.trim().toLowerCase(); // Normalize email for comparison
    let current = this.head;
    
    console.log("Searching for:", `"${email}"`); // Debugging output (show exact email being searched)
    
    while (current) {
        const storedEmail = current.data.getEmail().trim().toLowerCase(); // Normalize stored email
        console.log("Checking against:", `"${storedEmail}"`); // Debugging output

        if (storedEmail === email) {
            return current.data; // Return student if email matches
        }
        current = current.next;
    }
    return -1; // Student not found
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  clearStudents() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    // TODO
    let students = [];
    let current = this.head;
    while (current) {
        students.push(current.data.getName()); // we matches test format
        current = current.next;
    }
    return students.length ? students.join(', ') : "No students found.";
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    // TODO
    let students = [];
    let current = this.head;
    while (current) {
      students.push(current.data);
      current = current.next;
    }
    return students.sort((a, b) => a.getName().localeCompare(b.getName()))
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    // TODO
    let students = [];
    let current = this.head;
    while (current) {
      if (current.data.getSpecialization() === specialization) {
        students.push(current.data);
      }
      current = current.next;
    }
    return students.sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    // TODO
    let students = [];
    let current = this.head;
    while (current) {
      if (current.data.getYear() >= minAge) {
        students.push(current.data);
      }
      current = current.next;
    }
    return students.sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    // TODO
    const students = [];
    let current = this.head;
    while (current) {
      students.push({
        name: current.data.getName(),
        year: current.data.getYear(),
        email: current.data.getEmail(),
        specialization: current.data.getSpecialization(),
      });
      current = current.next;
    }
    fs.writeFileSync(fileName, JSON.stringify(students, null, 2));
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    // TODO
    try {
      const data = JSON.parse(fs.readFileSync(fileName, "utf8"));
      this.clearStudents(); // Fix issue with private method

      data.forEach(studentData => {
          const student = new Student(
              studentData.name,
              studentData.year,
              studentData.email,
              studentData.specialization
          );
          this.addStudent(student);
      });

      console.log("Students loaded successfully:", this.displayStudents()); // Debugging
  } catch (error) {
      console.error("Error loading file:", error);
    }
  }

}

module.exports = { LinkedList }
