from __future__ import with_statement
import alembic
from alembic import context
from sqlalchemy import engine_from_config, pool
from logging.config import fileConfig

from chainerrlui import SQLALCHEMY_DB_URI


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
# config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
# fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
# target_metadata = None


# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_online(config):
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool)

    with connectable.connect() as connection:
        alembic.context.configure(connection=connection)

        with alembic.context.begin_transaction():
            alembic.context.run_migrations()


def main():
    config = alembic.config.Config()
    config.set_main_option("sqlalchemy.url", SQLALCHEMY_DB_URI)
    run_migrations_online(config)


main()
