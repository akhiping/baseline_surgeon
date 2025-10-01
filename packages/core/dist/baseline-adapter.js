// Snapshot data for offline testing - this would be generated from web-features
const SNAPSHOT_DATA = {
    'structured-clone': {
        name: 'structuredClone',
        baseline: { newly_available: '2022-03-14' },
        mdn_url: 'https://developer.mozilla.org/docs/Web/API/structuredClone'
    },
    'url-canparse': {
        name: 'URL.canParse',
        baseline: { newly_available: '2023-03-14' },
        mdn_url: 'https://developer.mozilla.org/docs/Web/API/URL/canParse_static'
    },
    'array-at': {
        name: 'Array.prototype.at',
        baseline: { newly_available: '2022-03-14' },
        mdn_url: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/at'
    },
    'toggle-attribute': {
        name: 'Element.toggleAttribute',
        baseline: { newly_available: '2020-01-15' },
        mdn_url: 'https://developer.mozilla.org/docs/Web/API/Element/toggleAttribute'
    },
    'clipboard-write-text': {
        name: 'Clipboard.writeText',
        baseline: { newly_available: '2019-03-14' },
        mdn_url: 'https://developer.mozilla.org/docs/Web/API/Clipboard/writeText'
    },
    'intl-segmenter': {
        name: 'Intl.Segmenter',
        baseline: false,
        mdn_url: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter'
    },
    'view-transitions': {
        name: 'View Transitions API',
        baseline: false,
        mdn_url: 'https://developer.mozilla.org/docs/Web/API/View_Transitions_API'
    },
    'abort-signal-timeout': {
        name: 'AbortSignal.timeout',
        baseline: { newly_available: '2023-09-18' },
        mdn_url: 'https://developer.mozilla.org/docs/Web/API/AbortSignal/timeout_static'
    },
    'css-text-wrap-balance': {
        name: 'text-wrap: balance',
        baseline: false,
        mdn_url: 'https://developer.mozilla.org/docs/Web/CSS/text-wrap'
    },
    'css-focus-visible': {
        name: ':focus-visible',
        baseline: { newly_available: '2022-03-14' },
        mdn_url: 'https://developer.mozilla.org/docs/Web/CSS/:focus-visible'
    },
    'css-nesting': {
        name: 'CSS Nesting',
        baseline: { newly_available: '2023-03-14' },
        mdn_url: 'https://developer.mozilla.org/docs/Web/CSS/CSS_nesting'
    },
    'css-has-selector': {
        name: ':has() selector',
        baseline: { newly_available: '2023-12-26' },
        mdn_url: 'https://developer.mozilla.org/docs/Web/CSS/:has'
    }
};
export class DefaultBaselineAdapter {
    featureMap = new Map();
    targetDates = {
        'baseline-now': new Date(),
        'baseline-2024': new Date('2024-01-01'),
        'baseline-2025': new Date('2025-01-01')
    };
    constructor() {
        this.initializeFeatures();
    }
    initializeFeatures() {
        // For now, use snapshot data only
        // TODO: In production, this would load from web-features package
        Object.entries(SNAPSHOT_DATA).forEach(([id, feature]) => {
            this.featureMap.set(id, feature);
        });
    }
    isBaseline(featureId, target) {
        const feature = this.featureMap.get(featureId);
        if (!feature) {
            // Conservative: if we don't know about it, assume it's not baseline
            return false;
        }
        const baseline = feature.baseline;
        if (baseline === false || baseline === undefined) {
            return false;
        }
        if (baseline === true) {
            return true;
        }
        // Check if it became baseline before our target date
        if (typeof baseline === 'object' && baseline.newly_available) {
            const availableDate = new Date(baseline.newly_available);
            return availableDate <= this.targetDates[target];
        }
        return false;
    }
    info(featureId) {
        const feature = this.featureMap.get(featureId);
        if (!feature) {
            return undefined;
        }
        const result = {
            name: feature.name || featureId
        };
        if (feature.description) {
            result.description = feature.description;
        }
        if (feature.mdn_url) {
            result.mdn = feature.mdn_url;
        }
        if (feature.spec_url) {
            result.spec = feature.spec_url;
        }
        return result;
    }
    getAllFeatures() {
        return Array.from(this.featureMap.keys());
    }
    /**
     * Get the baseline status date for a feature
     */
    getBaselineDate(featureId) {
        const feature = this.featureMap.get(featureId);
        if (!feature?.baseline || typeof feature.baseline !== 'object' || !feature.baseline.newly_available) {
            return null;
        }
        return new Date(feature.baseline.newly_available);
    }
    /**
     * Check if a feature will be baseline by a specific date
     */
    willBeBaseline(featureId, targetDate) {
        const baselineDate = this.getBaselineDate(featureId);
        if (!baselineDate) {
            return false;
        }
        return baselineDate <= targetDate;
    }
}
//# sourceMappingURL=baseline-adapter.js.map