<script>
    import Icon from './../Icon/index.svelte';
    import IconWarning from './../../icons/16/icon.16.warning.svg';
    import IconInfo from './../../icons/16/icon.16.info.svg';
    import IconCheck from './../../icons/16/icon.16.check.svg';

    export let variant = 'danger'; // danger, warning, info, success
    export let message = ''; // Banner message (falls back to slot content if provided)

    let className = '';
    export { className as class };

    // Function to get the appropriate icon based on variant
    function getIcon() {
        switch (variant) {
            case 'danger':
                return IconWarning;
            case 'warning':
                return IconWarning;
            case 'info':
                return IconInfo;
            case 'success':
                return IconCheck;
            default:
                return IconWarning;
        }
    }

    // Function to determine the correct icon color based on variant
    function getIconColor() {
        return '--figma-color-icon';
    }
</script>

<div class="banner {variant} {className}">
    <div class="banner-icon-container">
        <Icon iconName={getIcon()} color={getIconColor()} />
    </div>
    <div class="banner-content">
        <div class="banner-message" role="alert" aria-relevant="all">
            <slot>{message}</slot>
        </div>
    </div>
</div>

<style>
    /* Base banner styles */
    .banner {
        display: flex;
        align-items: flex-start;
        border-radius: var(--border-radius-medium); /* 5px */
        border: 1px solid transparent;
        padding: var(--size-xxsmall); /* 8px */
        gap: var(--size-xxsmall); /* 8px */
        font-family: var(--font-stack);
        font-size: var(--body-medium-font-size);
        font-weight: var(--body-medium-font-weight);
        line-height: var(--body-medium-line-height);
        letter-spacing: var(--body-medium-letter-spacing);
    }

    .banner-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
    }

    .banner-content {
        display: flex;
        flex: 1;
        min-width: 0;
    }

    .banner-message {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    /* Danger variant */
    .banner.danger {
        background-color: var(--figma-color-bg-danger-tertiary);
        color: var(--figma-color-text);
    }

    /* Warning variant */
    .banner.warning {
        background-color: var(--figma-color-bg-warning-tertiary);
        color: var(--figma-color-text);
    }

    /* Info variant */
    .banner.info {
        background-color: var(--figma-color-bg-brand-tertiary);
        color: var(--figma-color-text);
    }

    /* Success variant */
    .banner.success {
        background-color: var(--figma-color-bg-success-tertiary);
        color: var(--figma-color-text);
    }
</style>

