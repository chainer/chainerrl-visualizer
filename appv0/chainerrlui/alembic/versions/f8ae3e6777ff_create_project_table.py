"""create project table

Revision ID: f8ae3e6777ff
Revises: 
Create Date: 2018-08-23 13:46:21.535937

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f8ae3e6777ff'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "project",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=512), nullable=False),
        sa.Column("path", sa.String(length=512), nullable=False),
        sa.UniqueConstraint("path"),
    )


def downgrade():
    op.drop_table("project")
