export const removeZeroStartNumber = (str: string|number)=>{
    return str.toString().replace(/^0+/, '')
}