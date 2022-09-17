const MAIN = document.querySelector('#main');
const DEFAULT_SETTINGS = {
    userName: '',
    nationalityList: [
        ENationality.UA,
        ENationality.US,
        ENationality.DK,
        ENationality.FR,
        ENationality.GB
    ],
    gender: EGenderFilter.all,
    sort: ESort.unsorted,
}

function filterFriends({ friends, settings }) {
    let res = friends;
    if (settings.userName) {
        const friendNameInLowerCase = settings.userName.toLowerCase();
        res = res.filter(friend => friend.name.toLowerCase().indexOf(friendNameInLowerCase) === 0)
    }
    res = res.filter(friend => settings.nationalityList.includes(friend.nat))
    if (settings.gender !== EGenderFilter.all) {
        res = res.filter(friend => settings.gender === friend.gender)
    }
    if (settings.sort !== ESort.unsorted) {
        if (settings.sort === ESort.ageAZ || settings.sort === ESort.ageZA) {
            const direction = (settings.sort === ESort.ageZA ? -1 : 1)
            res = res.sort((friendA, friendB) => {
                return (friendA.age - friendB.age) * direction
            })
        }
        else if (settings.sort === ESort.nameAZ || settings.sort === ESort.nameZA) {
            const direction = (settings.sort === ESort.nameZA ? -1 : 1)
            res = res.sort((friendA, friendB) => {
                return friendA.name.localeCompare(friendB.name) * direction
            })
        }
    }
    return res;
}

let FRIENDS = [];
function onSettingsChange({ settings }) {
    const filteredFriends = filterFriends({ friends: FRIENDS, settings })
    if (!settings.nationalityList.length) {
        console.log('no friends')
        MAIN_EL.classList.add('no-results')
    } else {
        MAIN_EL.classList.remove('no-results')
    }
    renderFriends({ friends: filteredFriends })
}
initFriendsAsync({
    onFriendsLoaded: ({ friends }) => {
        FRIENDS = friends;
        initSettings({
            settings: DEFAULT_SETTINGS,
            onSettingsChange
        });
    }
});
