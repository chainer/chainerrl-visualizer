"""create project table

Revision ID: f8ae3e6777ff
Revises: 
Create Date: 2018-08-23 13:46:21.535937

"""
from alembic import op
import sqlalchemy as sa
import datetime

# revision identifiers, used by Alembic.
revision = 'f8ae3e6777ff'
down_revision = None
branch_labels = None
depends_on = None

now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")


def upgrade():
    op.create_table(
        "project",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=512), nullable=False),
        sa.Column("path", sa.String(length=512), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=now),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=now),
        sa.UniqueConstraint("path"),
    )


def downgrade():
    op.drop_table("project")
