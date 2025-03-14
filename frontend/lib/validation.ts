export function camelCaseToSentenceCase(inputString: string): string {
    const caseString = inputString
      .replace(/([A-Z])(?=[a-z])/g, " $1")
      .replace(/([A-Z])/g, "$1")
      .trim()
  
    return caseString.charAt(0).toUpperCase() + caseString.slice(1)
  }
  
  export const validateEmail = (email: string): string | null => {
    if (!email) {
      return "Email is required"
    }
  
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(email)) {
      return "Invalid email address"
    }
  
    return null
  }
  
  export const validatePassword = (password: string): string | null => {
    if (!password) {
      return "Password is required"
    }
  
    if (password.length < 8) {
      return "Password must be at least 8 characters"
    }
  
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
  
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
  
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number"
    }
  
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character"
    }
  
    return null
  }
  
  export const validateName = (name: string): string | null => {
    if (!name) {
      return "Name is required"
    }
  
    if (name.length < 2) {
      return "Name must be at least 2 characters"
    }
  
    return null
  }
  
  export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) {
      return "Please confirm your password"
    }
  
    if (password !== confirmPassword) {
      return "Passwords do not match"
    }
  
    return null
  }
  
  export const emailValidationFunc = (email: string, errors: Record<string, string>) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i
  
    if (!email) {
      errors.email = "A valid email address is required"
    } else if (!emailRegex.test(email)) {
      errors.email = "Email address is invalid"
    }
  }
  
  export const loginValidation = (values: { email: string; password: string }) => {
    const errors: Record<string, string> = {}
    const { email, password } = values
    emailValidationFunc(email, errors)
  
    if (!password) {
      errors.password = "Password is required"
    }
  
    return errors
  }
  
  export const buyerSignUpValidation = (values: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    hostelName: string
    blockNumber: string
    roomNo: string
  }) => {
    const errors: Record<string, string> = {}
    const { firstName, lastName, email, password, confirmPassword, hostelName, blockNumber, roomNo } = values
  
    emailValidationFunc(email, errors)
  
    if (!firstName) {
      errors.firstName = "First name is required"
    }
  
    if (!/^[\w\s'&.-]+$/.test(firstName)) {
      errors.firstName = "Special characters not allowed"
    }
  
    if (!lastName) {
      errors.lastName = "Last name is required"
    }
  
    if (!/^[\w\s'&.-]+$/.test(lastName)) {
      errors.lastName = "Special characters not allowed"
    }
  
    if (!hostelName) {
      errors.hostelName = "Hostel name is required"
    }
  
    if (!blockNumber) {
      errors.blockNumber = "Block number is required"
    } else if (isNaN(Number(blockNumber))) {
      errors.blockNumber = "Block number must be a number"
    }
  
    if (!roomNo) {
      errors.roomNo = "Room number is required"
    } else if (isNaN(Number(roomNo))) {
      errors.roomNo = "Room number must be a number"
    }
  
    if (!password) {
      errors.password = "Password is required"
    } else if (password.length > 2 && password.length < 8) {
      errors.password = "Minimum of 8 characters"
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])/.test(password)) {
      if (!/(?=.*[-+_!@#$%^&.,?])/.test(password)) {
        errors.password = "Should contain special character -+_!@#$%^&*.,?"
      } else if (!/(?=.*\d)/.test(password)) {
        errors.password = "Should contain number"
      } else if (!/(?=.*[A-Z])/.test(password)) {
        errors.password = "Should contain capital letter"
      }
    }
  
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }
  
    return errors
  }
  
  export const sellerSignUpValidation = (values: {
    firstName: string
    lastName: string
    email: string
    businessName: string
    phoneNumber: string
    bankName: string
    accountNumber: string
    password: string
    confirmPassword: string
  }) => {
    const errors: Record<string, string> = {}
    const { firstName, lastName, email, businessName, phoneNumber, bankName, accountNumber, password, confirmPassword } =
      values
  
    emailValidationFunc(email, errors)
  
    if (!firstName) {
      errors.firstName = "First name is required"
    }
  
    if (!/^[\w\s'&.-]+$/.test(firstName)) {
      errors.firstName = "Special characters not allowed"
    }
  
    if (!lastName) {
      errors.lastName = "Last name is required"
    }
  
    if (!/^[\w\s'&.-]+$/.test(lastName)) {
      errors.lastName = "Special characters not allowed"
    }
  
    if (!businessName) {
      errors.businessName = "Business name is required"
    }
  
    if (!/^[\w\s'&.-]+$/.test(businessName)) {
      errors.businessName = "Special characters not allowed"
    }
  
    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required"
    } else if (!/^\d{10,15}$/.test(phoneNumber.replace(/\D/g, ""))) {
      errors.phoneNumber = "Enter valid phone number"
    }
  
    if (!bankName) {
      errors.bankName = "Bank name is required"
    }
  
    if (!accountNumber) {
      errors.accountNumber = "Account number is required"
    } else if (!/^\d{10,12}$/.test(accountNumber.replace(/\D/g, ""))) {
      errors.accountNumber = "Enter valid account number"
    }
  
    if (!password) {
      errors.password = "Password is required"
    } else if (password.length > 2 && password.length < 8) {
      errors.password = "Minimum of 8 characters"
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])/.test(password)) {
      if (!/(?=.*[-+_!@#$%^&.,?])/.test(password)) {
        errors.password = "Should contain special character -+_!@#$%^&*.,?"
      } else if (!/(?=.*\d)/.test(password)) {
        errors.password = "Should contain number"
      } else if (!/(?=.*[A-Z])/.test(password)) {
        errors.password = "Should contain capital letter"
      }
    }
  
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }
  
    return errors
  }
  
  export const resetPasswordRequestValidation = (values: { email: string }) => {
    const errors: Record<string, string> = {}
    const { email } = values
    emailValidationFunc(email, errors)
  
    return errors
  }
  
  export const resetPasswordValidation = (values: { password: string; confirm_password: string }) => {
    const errors: Record<string, string> = {}
    const { password, confirm_password } = values
  
    if (!password || !confirm_password) {
      errors.confirm_password = "Both password and confirm password are required"
    } else if (password !== confirm_password) {
      errors.confirm_password = "Both passwords must match"
    } else if (password.length > 2 && password.length < 8) {
      errors.password = "Minimum of 8 characters"
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?])/.test(password)) {
      if (!/(?=.*[-+_!@#$%^&.,?])/.test(password)) {
        errors.password = "Should contain special character -+_!@#$%^&*.,?"
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.password = "Should contain number"
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.password = "Should contain capital letter"
      }
    }
  
    return errors
  }
  
  