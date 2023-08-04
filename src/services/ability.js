import { createMongoAbility } from '@casl/ability';

// const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

const buildRules = (permissions) => {
    if(!permissions) { return []}
    return permissions.map(p => {
        var rule = {
            action: p.action,
            subject: p.subject
        }
        if (p.fields && p.fields.lenght > 0) {
            rule.fields = p.fields;
        }
        var conditions = {};
        if (p.groupIds && p.groupIds.lenght > 0) {
            conditions.groupIds = { $in: p.groupIds }
        }

        return rule;
        // return {
        //     action: p.action,
        //     subject: p.subject,
        //     fields: p.fields,
        //     conditions: {
        //         groupIds: { $in: p.groupIds}
        //     }
        // }
    })
}
export { buildRules };
// can('delete', 'shareable', { sharingLevel: 0});

// export default build();

// export default function defineAbilityFor()

export default createMongoAbility(buildRules());

