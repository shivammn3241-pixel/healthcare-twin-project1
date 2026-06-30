import sys
import os

# Add the project root directory to the Python path to ensure backend imports work correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
