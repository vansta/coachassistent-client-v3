const storageKey = 'ca-permissions';
import { createMongoAbility, detectSubjectType } from '@casl/ability';

// const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

const setPermissions  = (permissions) => {
    localStorage.setItem(storageKey, JSON.stringify(permissions));
}

const getPermissions = () => {
    return JSON.parse(localStorage.getItem(storageKey));
}

const buildRules = (permissions) => {
    if(!permissions || permissions.length == 0) {
        permissions = getPermissions();
        if (!permissions || permissions.length == 0) {
            return [{}];
        }
    }
    return permissions.map(p => {
        var rule = {
            action: p.action,
            subject: p.subject,
            reason: p.reason
        }
        if (p.fields && p.fields.lenght > 0) {
            rule.fields = p.fields;
        }
        var conditions = {};
        if (p.groupIds && p.groupIds.length > 0) {
            conditions.groupIds = { $in: p.groupIds }
        }
        if (p.userId) {
            conditions.editorIds = { $in: [p.userId] }
        }
        
        if (conditions) {
            rule.conditions = conditions;
        }

        return rule;
    });
}

const getSubjectType = (subject) => {
    if (subject && typeof subject === 'object' && subject.constructor.modelName) {
        return subject.constructor.modelName;
    }
    return detectSubjectType(subject);
}

export { buildRules, setPermissions, getPermissions };

export default createMongoAbility(buildRules(), {
    detectSubjectType: getSubjectType
});

