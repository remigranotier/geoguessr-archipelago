import { SoundEffectType } from "../../common/models";
import endSoundUrl from '~/assets/papayou.mp3';
import itemReceivedSoundUrl from '~/assets/notif.mp3';
import locationsCheckedSoundUrl from '~/assets/success.mp3';

export function initVolumeBar() {
    let volumeIcon = document.getElementById('volume-bar-icon') as HTMLLabelElement;
    let volumeBar = document.getElementById('volume-bar') as HTMLInputElement;
    chooseVolumeIcon()
    volumeIcon.removeEventListener("click", volumeIconClickHandler)
    volumeIcon.addEventListener("click", volumeIconClickHandler)
    volumeBar.addEventListener("change", function(e) {
        chooseVolumeIcon()
    })
}

export function volumeIconClickHandler(e: Event) {
    let volumeBar = document.getElementById('volume-bar') as HTMLInputElement;
    if (volumeBar.valueAsNumber > 0) {
        volumeBar.setAttribute("previousValueNotZero", volumeBar.value)
        volumeBar.value = "0"
    } else {
        volumeBar.value = volumeBar.getAttribute("previousValueNotZero") ?? "100"
    }
    chooseVolumeIcon()
}

export function chooseVolumeIcon() {
    let volumeIcon = document.getElementById('volume-bar-icon') as HTMLLabelElement;
    let volumeBar = document.getElementById('volume-bar') as HTMLInputElement;

    const volume = volumeBar.valueAsNumber
    if (volume == 0) {
        volumeIcon.textContent = "🔇"
    } else if (volume <= 30) {
        volumeIcon.textContent = "🔈"
    } else if (volume <= 70) {
        volumeIcon.textContent = "🔉"
    } else {
        volumeIcon.textContent = "🔊"
    }

    if (volume != 0) {
        volumeBar.setAttribute("previousValueNotZero", volumeBar.value)
    }
}

export function playSoundEffect(type: SoundEffectType) {
    if (type == SoundEffectType.None) {
        return;
    }

    const sound = new Audio()
    let volumeBar = document.getElementById('volume-bar') as HTMLInputElement;
    if (volumeBar !== null) {
        sound.volume = volumeBar.valueAsNumber / 100
    }
    volumeBar.addEventListener("change", function(e) {
        sound.volume = (e.currentTarget as HTMLInputElement).valueAsNumber / 100;
    })
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

    void sound.play()
}