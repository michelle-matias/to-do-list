// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (!publicRole) {
        strapi.log.warn('Public role not found while applying todo permissions.');
        return;
      }

      const actions = ['find', 'findOne', 'create', 'update', 'delete'];
      for (const action of actions) {
        const permissionAction = `api::todo.todo.${action}`;
        const existingPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: {
            action: permissionAction,
            role: publicRole.id,
          },
        });

        if (!existingPermission) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action: permissionAction,
              role: publicRole.id,
              enabled: true,
              policy: '',
            },
          });
        } else if (!existingPermission.enabled) {
          await strapi.db.query('plugin::users-permissions.permission').update({
            where: { id: existingPermission.id },
            data: { enabled: true },
          });
        }
      }

      strapi.log.info('Todo permissions automatically enabled for public role.');
    } catch (error) {
      strapi.log.error('Failed to configure todo public permissions', error);
    }
  },
};
