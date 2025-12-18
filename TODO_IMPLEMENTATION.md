# Implementation Plan for Maid Role and Principal Approval Requirements

## Tasks to Complete

### 1. Frontend Changes
- [x] Add 'maid' role to SignUp.js roles array
- [x] Modify SignUp.js to include additional fields for principals (school description, document URL)
- [x] Update UserApprovalPage to handle admin approval of principals

### 2. Backend Changes
- [x] Update auth.js signup to check for existing principal per school and set principal status to 'pending_admin'
- [x] Modify approve-user endpoint to allow admin approval of principals

### 3. Testing
- [ ] Test signup and approval flows
- [ ] Implement actual file upload for documents (currently using URL placeholder)
