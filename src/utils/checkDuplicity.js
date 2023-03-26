export function checkForDuplicity(array) {
    const arrayHashTable = {}
    let arrayCopy = [...array]
    let indexesToRemove = []

    for (let i = 0; i < array.length; i++) {
        if (arrayHashTable[array[i].postId]) {
            indexesToRemove.push(i)
        }
        else arrayHashTable[array[i].postId] = true
    }
    if (indexesToRemove.length) {
        indexesToRemove.forEach(index => {
            arrayCopy.splice(index, 1)
        })
        return arrayCopy
    }
    return array
}