"""Create experiment table

Revision ID: 2a4323b2f26f
Revises: f8ae3e6777ff
Create Date: 2018-08-24 16:57:52.104528

"""
from alembic import op
import sqlalchemy as sa
import datetime

# revision identifiers, used by Alembic.
revision = '2a4323b2f26f'
down_revision = 'f8ae3e6777ff'
branch_labels = None
depends_on = None

now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")


def upgrade():
    op.create_table(
        "experiment",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(512), nullable=False),
        sa.Column("path", sa.String(512), nullable=False),
        sa.Column("rollout_path", sa.String(512), default=""),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=now),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=now),
        sa.UniqueConstraint("path"),
        sa.ForeignKeyConstraint(["project_id"], ["project.id"]),
    )


def downgrade():
    op.drop_table("experiment")
