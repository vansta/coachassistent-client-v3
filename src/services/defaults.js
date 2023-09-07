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
    sharingLevel: '3',
    level: 0
});

const getDefaultSegment = (userId) => ({
    id: '',
    name: '',
    description: '',
    exercises: [],
    editorIds: [userId],
    constructor: { modelName: 'shareable' },
    sharingLevel: '0',
    level: '0'
})

const getDefaultTraining = (userId) => ({
    description: '',
    segments: [],
    sharingLevel: '0',
    editorIds: [userId],
    constructor: { modelName: 'shareable' },
    level: '0'
})

const getDefaultGroup = (userId, parentGroupId) => ({
    id: null,
    constructor: { modelName: 'group' },
    members: [
        { userId: userId }
    ],
    parentGroupId: parentGroupId
});

const levels = ['0', '1', '2', '3', '4'].map(l => ({ title: l, value: l }));

export { getDefaultExercise, getDefaultSegment, getDefaultTraining, getDefaultGroup, levels };
