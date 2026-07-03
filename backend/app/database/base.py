# Import all the models so that Base has them before being
# imported by Alembic migration scripts.
# This ensures Alembic can autogenerate migrations correctly.

from app.database.base_class import Base  # noqa

# 1. Authentication & Users
from app.models.user import User, Role, UserRole, RolePermission, Permission  # noqa

# 2. Colleges & Structure
from app.models.college import College, Department, Branch  # noqa

# 3. Student Profiles & Credentials
from app.models.student import StudentProfile, Resume, ResumeVersion, Achievement, Leaderboard, StudentAchievement  # noqa

# 4. Recruitment Drives & Applications
from app.models.drive import Company, CompanyRole, PlacementDrive, Application  # noqa

# 5. Academic Prep & Questions
from app.models.academic import Subject, Topic, Question  # noqa

# 6. Coding DSA Problems & Submissions
from app.models.coding import CodingProblem, CodingSubmission  # noqa

# 7. Mock Interviews
from app.models.interview import MockInterview  # noqa

# 8. User Interactions, Notifications, Logs
from app.models.interaction import Bookmark, Notification, ActivityLog  # noqa
