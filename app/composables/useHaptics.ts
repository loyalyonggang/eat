import { Haptics, ImpactStyle } from '@capacitor/haptics'

/**
 * 震动反馈组合函数
 */
export function useHaptics() {
  // 轻微震动 - 适用于按钮点击
  const lightImpact = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
    }
    catch {
      // 震动不支持，静默处理
    }
  }

  // 中等震动 - 适用于重要操作
  const mediumImpact = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
    }
    catch {
      // 震动不支持，静默处理
    }
  }

  // 强烈震动 - 适用于警告或重要提示
  const heavyImpact = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy })
    }
    catch {
      // 震动不支持，静默处理
    }
  }

  // 成功震动
  const successNotification = async () => {
    try {
      await Haptics.notification({ type: 'SUCCESS' })
    }
    catch {
      // 震动不支持，静默处理
    }
  }

  // 警告震动
  const warningNotification = async () => {
    try {
      await Haptics.notification({ type: 'WARNING' })
    }
    catch {
      // 震动不支持，静默处理
    }
  }

  // 错误震动
  const errorNotification = async () => {
    try {
      await Haptics.notification({ type: 'ERROR' })
    }
    catch {
      // 震动不支持，静默处理
    }
  }

  // 自定义震动模式
  const customVibrate = async (_pattern: number[]) => {
    try {
      // 对于不支持自定义模式的设备，使用中等强度震动
      await Haptics.impact({ style: ImpactStyle.Medium })
    }
    catch {
      // 震动不支持，静默处理
    }
  }

  return {
    lightImpact,
    mediumImpact,
    heavyImpact,
    successNotification,
    warningNotification,
    errorNotification,
    customVibrate,
  }
}
