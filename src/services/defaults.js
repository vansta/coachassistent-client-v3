const getDefaultExercise = (userId) => ({
    id: '',
    name: '',
    description: '',
    edit: true,
    dialog: true,
    attachments: [],
    editorIds: [userId],
    constructor: { modelName: 'shareable' },
    tags: [],
    sharingLevel: '3'
});

const getDefaultGroup = (userId, parentGroupId) => ({
    id: null,
    constructor: { modelName: 'group' },
    members: [
        { userId: userId }
    ],
    parentGroupId: parentGroupId
})

export { getDefaultExercise, getDefaultGroup };