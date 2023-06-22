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
        return `${user.bio.lastName} ${user.bio.firstName} ${user.bio.patronymic}`
    } else {
        return id
    }
}

export function getDate(date){
    date = new Date(date)
    if((date.getMonth()+1)<9){
        return `${date.getDate()}.0${date.getMonth()+1}.${date.getFullYear()}`
    }else {
        return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
    }
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

export function getThemes(sub, thems, subjects){
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

        return themes.join(', ')
    } else {
        return thems.join(', ')
    }
}

export function getTheme(sub, theme, subjects){
    const subject = subjects.find(subject=>subject.id==sub)

    const themeName = subject.themes.find(item => item.id==theme)
    if(themeName){
        return themeName.name.ru
    }else {
        return theme
    }
}