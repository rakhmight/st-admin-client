export function getSubject(id, subjects, lang=undefined){
    let target = subjects.find(subject=>subject.id==id)
    if(target){
        return target.name.ru
    } else {
        return id
    }
}

export function getAuthor(id, users){
    const user = users.find(user => user.id == id)
    if(user){
        return `${user.bio.firstName} ${user.bio.lastName} ${user.bio.patronymic ? user.bio.patronymic : ''}`
    } else {
        return id
    }
}

export function getGroup(id, users, mode){
    const user = users.find(user => user.id == id)

    if(mode == 'full') return `${user.roleProperties.group<10 ? `${getCourse(user.roleProperties.recieptDate)}0` : getCourse(user.roleProperties.recieptDate)}${user.roleProperties.group}`
    else if(mode == 'min') return user.roleProperties.group
}

export function getCourse(year){
    year = +year
    let nextEducationYear = false
    let currentYear = new Date().getFullYear()
    if(new Date().getMonth()>8){
        nextEducationYear = true
    }

    if(nextEducationYear && currentYear-year!=3){
        return (currentYear-year)+1
    }
    return currentYear-year
}

export function getDate(date){
    date = new Date(date)
    return `${date.getDate()<10 ? `0${date.getDate()}` : date.getDate()}.${date.getMonth()+1<10 ? `0${date.getMonth()+1}` : date.getMonth()+1}.${date.getFullYear()}`
}

export function getLanguages(langs){
    let languages = []
    langs.forEach(lang=>{
        if(lang=='custom'){
            languages.push('Foreign')
        } else if(lang=='fr'){
            languages.push('France')
        } else if(lang=='de'){
            languages.push('Deutsch')
        } else if(lang=='ru'){
            languages.push('Русский')
        } else if(lang=='eng'){
            languages.push('English')
        } else if(lang=='uz_l'){
            languages.push("O'zbek")
        } else if(lang=='uz_k'){
            languages.push('Ўзбек')
        }
    })
    return languages.join(', ')
}

export function getThemes(sub, thems, subjects, isArray=false){
    let target = subjects.find(subject=>subject.id==sub)
    if(target){
        let themes = []
        thems.forEach(item=>{
            let ThTarget = target.themes.find(theme=> theme.id==item)
            if(ThTarget){
                themes.push(ThTarget.name.ru)
            } else {
                themes.push(item)
            }
        })

        if(isArray) return themes
        else return themes.join(', ')
        
    } else {
        if(isArray) return thems
        else return thems.join(', ')
    }
}

export function getTheme(sub, theme, subjects){
    console.log(sub);
    const subject = subjects.find(subject=>subject.id==sub)

    const themeName = subject.themes.find(item => item.id==theme)
    if(themeName){
        return themeName.name.ru
    }else {
        return theme
    }
}