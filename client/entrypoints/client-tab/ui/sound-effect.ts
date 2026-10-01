import { SoundEffectType } from "../../common/models";
import endSoundUrl from '~/assets/papayou.mp3';
import itemReceivedSoundUrl from '~/assets/notif.mp3';
import locationsCheckedSoundUrl from '~/assets/success.mp3';

export function playSoundEffect(type: SoundEffectType) {
    if (type == SoundEffectType.None) {
        return;
    }

    const sound = new Audio()
    sound.volume = 0.15
    switch (type) {
        case SoundEffectType.ItemReceived:
            sound.src = itemReceivedSoundUrl
            break;
        case SoundEffectType.LocationChecked:
            sound.src = locationsCheckedSoundUrl
            break;
        case SoundEffectType.GoalReached:
            sound.src = endSoundUrl
            break;
        default:
            console.error("Unknown sound effect to play", type)
    }

    sound.play()
}