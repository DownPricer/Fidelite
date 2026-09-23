# Graph Report - Cartefidelité  (2026-09-23)

## Corpus Check
- 587 files · ~4,726,166 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 3122 nodes · 9656 edges · 152 communities (133 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38f3b166`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- customer-reward-progress.ts
- card-template-schema.ts
- scan/ui.tsx
- merchant-card-template-service.ts
- next
- react
- loyalty-commit.ts
- ref_next_navigation
- fife-life/merchant-detail.tsx
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- profile-shared.tsx
- card-editor-canvas.tsx
- jsonOk
- loyalty-service.ts
- google-wallet/route.ts
- wallet-home.tsx
- cn
- events/route.ts
- outils/ui.tsx
- profile-page.tsx
- cashier-checkout.tsx
- customer-loyalty-overview.ts
- google-auth.ts
- isProduction
- loyalty-labels.ts
- session.ts
- loyalty-program.ts
- reward-form-dialog.tsx
- use-wallet-unlock-animation.ts
- app/statistiques/page.tsx
- requireMerchantAdmin
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- google-wallet.ts
- demo-session.ts
- What You Must Do When Invoked
- card-editor-properties.tsx
- media-storage.ts
- loyalty-commit.test.ts
- interactive-loyalty-card.tsx
- ref_fs_promises
- ref_next_headers
- src/app/page.tsx
- compilerOptions
- card-editor-polish.test.ts
- loyalty-program-publication.ts
- qr-cache.ts
- qa-login.ts
- ref_node_path
- dependencies
- syncGoogleWalletMembershipObject
- email.ts
- devDependencies
- insight-stats.ts
- resolvePublishedMerchantCardTemplate
- demo-visual.ts
- ref_next_link
- loyalty-service.test.ts
- scripts
- api-merchant-statistics-route.test.ts
- platform-stats.ts
- google-wallet-appearance.ts
- ProgramConfigurator
- @prisma/client
- customer-history.ts
- webhook/route.ts
- card-deck.tsx
- merchants-list.tsx
- types.ts
- AdvantagesEditor
- SettingsPage
- caisse-scan.ts
- unsubscribe-token.ts
- EmployeeDetailPanel
- MerchantDetailPage
- [kind]/route.ts
- layout-shell.tsx
- cartes.js
- Fidelo
- docker-entrypoint.sh
- seed.ts
- merchant-card-renderer.tsx
- vitest
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- super-admin-session.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- ref_path
- rbac.ts
- program/route.ts
- src/app/layout.tsx
- landing-header.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- api-guard.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- employee-session.ts
- insight-definitions.ts
- CreateMerchantWizard
- env.ts
- EmployeeLoginScreen
- campaign-confirm-route.test.ts
- customer-qr.ts
- landing-page.test.ts
- caisse-scan-route.test.ts
- merchant-card-finish.test.ts
- landing-hero-visual.tsx
- lib/campaign-worker.ts
- discover-page.tsx
- cards-index.tsx
- customer-push-route.test.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- landing-faq.tsx
- campaign-crud-routes.test.ts
- customer-qr-route.test.ts
- jsonError
- push-client.ts
- google-wallet-doctor.ts
- getSessionUser
- loyalty-reward-removal.ts
- landing-merchant-preview.tsx
- employees/[id]/route.ts
- CardEditorBackgroundCrop
- resolveLandingAuthTargets
- MerchantHome
- use-media-query.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- SettingsPanel

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 188 edges
2. `jsonOk()` - 170 edges
3. `requireMutatingRequest()` - 115 edges
4. `prisma` - 108 edges
5. `react` - 95 edges
6. `vitest` - 91 edges
7. `@prisma/client` - 90 edges
8. `clientIp()` - 88 edges
9. `userAgent()` - 84 edges
10. `readJson()` - 81 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `signQrToken()`  [EXTRACTED]
  prisma/seed.ts → src/lib/qr.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `mockLoyaltyContext()` --calls--> `loyaltyUnitForMode()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-labels.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (152 total, 19 thin omitted)

### Community 0 - "customer-reward-progress.ts"
Cohesion: 0.22
Nodes (16): buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, evaluateCustomerRewards() (+8 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.10
Nodes (28): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CARD_SCHEMA_VERSION, CardDecorativeStyle (+20 more)

### Community 2 - "scan/ui.tsx"
Cohesion: 0.06
Nodes (56): GET(), ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeScanPage(), EmployeeProfile, EmployeeScanScreen(), Phase (+48 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (52): LegacyCardEditorRedirect(), CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), cardSlotForLoyaltyMode(), isLoyaltyProgramSlot() (+44 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.08
Nodes (27): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), EmployeeInvitationScreen(), ChangePasswordPage(), SPACES (+19 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.18
Nodes (19): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+11 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.25
Nodes (20): ref_next_navigation, CampagnesPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), OutilsPage() (+12 more)

### Community 8 - "fife-life/merchant-detail.tsx"
Cohesion: 0.09
Nodes (20): ref_react_dom_server, AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink() (+12 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.10
Nodes (21): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct(), ProgressCircle() (+13 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (53): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), publishValidationResult() (+45 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (50): DELETE(), POST(), GET(), POST(), GET(), POST(), GET(), GET() (+42 more)

### Community 12 - "profile-shared.tsx"
Cohesion: 0.22
Nodes (11): APP_VERSION, APPEARANCE_OPTIONS, AppearanceRow(), demoQuery(), EditField, fieldLabels, PasswordStrength(), ProfileShell() (+3 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.11
Nodes (35): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+27 more)

### Community 14 - "jsonOk"
Cohesion: 0.11
Nodes (66): POST(), POST(), POST(), POST(), POST(), POST(), logScanBody(), POST() (+58 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.30
Nodes (11): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), computeLoyalty(), LoyaltyError, LoyaltySnapshot, applyLoyaltyAction(), ApplyLoyaltyInput (+3 more)

### Community 16 - "google-wallet/route.ts"
Cohesion: 0.09
Nodes (41): GET(), POST(), POST(), dynamic, logCustomerQr(), POST(), runtime, schema (+33 more)

### Community 17 - "wallet-home.tsx"
Cohesion: 0.11
Nodes (22): ref_motion_react, react-dom, ref_react_dom_client, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCode() (+14 more)

### Community 18 - "cn"
Cohesion: 0.09
Nodes (32): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel() (+24 more)

### Community 19 - "events/route.ts"
Cohesion: 0.19
Nodes (15): POST(), dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk() (+7 more)

### Community 20 - "outils/ui.tsx"
Cohesion: 0.29
Nodes (5): FidelisationPanel(), icons, OutilsPanel(), TOOLS, ToolCard()

### Community 21 - "profile-page.tsx"
Cohesion: 0.18
Nodes (15): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+7 more)

### Community 22 - "cashier-checkout.tsx"
Cohesion: 0.10
Nodes (33): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+25 more)

### Community 23 - "customer-loyalty-overview.ts"
Cohesion: 0.15
Nodes (21): activityFromWalletEvent(), buildCardNextRewardEntry(), buildFifeLifeNextReward(), buildHistoricalRewardOverview(), buildNextRewardCandidates(), CardNextRewardEntry, CardRewardProgress, CustomerLoyaltyOverview (+13 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "isProduction"
Cohesion: 0.16
Nodes (18): isProduction(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), assertSuperAdminProductionConfig() (+10 more)

### Community 26 - "loyalty-labels.ts"
Cohesion: 0.17
Nodes (22): TargetBlock(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), progressLineForTarget(), availableRewardModules(), buildGoogleWalletMerchantView() (+14 more)

### Community 27 - "session.ts"
Cohesion: 0.23
Nodes (6): ref_next_server, GET(), getRequestUser(), SessionUser, tokenFromRequest(), userFromToken()

### Community 28 - "loyalty-program.ts"
Cohesion: 0.09
Nodes (38): DEMO_CONFIG, MODES, PROGRAM_STEPS, block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, evaluateEarn() (+30 more)

### Community 29 - "reward-form-dialog.tsx"
Cohesion: 0.20
Nodes (12): emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit(), rewardTypeLabel(), RewardTypeOption (+4 more)

### Community 30 - "use-wallet-unlock-animation.ts"
Cohesion: 0.20
Nodes (17): isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), hasRenderReadyTemplate(), cardFromUnlockPayload(), fetchUnlockCardDetail(), isUnlockCardReadyForReveal() (+9 more)

### Community 31 - "app/statistiques/page.tsx"
Cohesion: 0.18
Nodes (9): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), FideliteTab(), fmtDays(), fmtNum(), FrequentationTab(), RecompensesTab() (+1 more)

### Community 32 - "requireMerchantAdmin"
Cohesion: 0.18
Nodes (29): POST(), POST(), GET(), GET(), POST(), serializeCampaign(), requireMerchantAdmin(), AudienceEstimate (+21 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (33): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+25 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (30): ApiResponse, COMPARISON_METRICS, FinancesTab(), LockedPlaceholder, MAX_COMPARISON_METRICS, MIN_COMPARISON_METRICS, normalizeBase100(), OverviewTab() (+22 more)

### Community 37 - "google-wallet.ts"
Cohesion: 0.25
Nodes (18): appLinkData(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), GoogleWalletImage, googleWalletLogoUrl(), GoogleWalletMerchantView (+10 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.16
Nodes (16): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), applyDemoRoleCookies() (+8 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "card-editor-properties.tsx"
Cohesion: 0.14
Nodes (19): REQUIRED_BY_SLOT, TEXT_TYPES, BACKGROUND_FIT_LABELS, containsForbiddenTechnicalLabel(), DATA_KEY_LABELS, dataKeyLabel(), ELEMENT_TYPE_LABELS, FIT_MODE_LABELS (+11 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.15
Nodes (24): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, deleteCardBackgroundIfUnused() (+16 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "interactive-loyalty-card.tsx"
Cohesion: 0.09
Nodes (30): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveCardShell(), InteractiveCardShellProps, InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps (+22 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.11
Nodes (15): ref_fs_promises, ref_sharp, OUT, tiers, files, INPUT_DIR, GET(), MIME (+7 more)

### Community 45 - "ref_next_headers"
Cohesion: 0.14
Nodes (19): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled() (+11 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.13
Nodes (20): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+12 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "card-editor-polish.test.ts"
Cohesion: 0.17
Nodes (22): useWalletEvents(), connect(), disconnect(), onVisibility(), WalletHome(), googleWalletEndpointForActiveCard(), canUseSessionStorage(), getStoredLastEventId() (+14 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "qr-cache.ts"
Cohesion: 0.17
Nodes (16): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr() (+8 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (36): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken() (+28 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (39): ref_node_buffer, ref_node_fs, ref_node_fs_promises, ref_node_path, ref_node_url, ref_node_zlib, playwright, OUT (+31 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "syncGoogleWalletMembershipObject"
Cohesion: 0.15
Nodes (26): accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue(), ensureGlobalClassRecord() (+18 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (14): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+6 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.08
Nodes (56): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+48 more)

### Community 58 - "resolvePublishedMerchantCardTemplate"
Cohesion: 0.23
Nodes (12): GET(), GET(), logMerchantCardSwitch(), MerchantCardSwitchContext, MerchantCardSwitchStep, adaptTemplateConfigForGeneralSlot(), findPublishedForSlot(), normalizeResolvedPublishedTemplate() (+4 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.15
Nodes (21): CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_CARDS, PREVIEW_PREFERENCES, PREVIEW_PROFILE, PREVIEW_PROFILE_HISTORY (+13 more)

### Community 60 - "ref_next_link"
Cohesion: 0.13
Nodes (9): ref_next_link, SPACES, COLUMNS, isInternalPath(), LandingFooter(), MerchantCardsGallery(), slotStatusLabel(), slotTone() (+1 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 64 - "platform-stats.ts"
Cohesion: 0.24
Nodes (14): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+6 more)

### Community 65 - "google-wallet-appearance.ts"
Cohesion: 0.16
Nodes (12): contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS, GoogleWalletAppearance, googleWalletAppearanceSchema, googleWalletButtonLabelSchema, GoogleWalletConfigMap, googleWalletHexSchema, isReadableGoogleWalletColor() (+4 more)

### Community 66 - "ProgramConfigurator"
Cohesion: 0.23
Nodes (10): modeTitle(), ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction(), publish(), saveDraft(), unitForMode() (+2 more)

### Community 67 - "@prisma/client"
Cohesion: 0.14
Nodes (24): @prisma/client, formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), ActiveMerchantLoyaltyContext, buildCustomerProgramView() (+16 more)

### Community 68 - "customer-history.ts"
Cohesion: 0.32
Nodes (6): BenefitEntry, formatLoyaltyEntry(), HistoryCategory, HistoryEntry, mapLoyaltyCategory(), mapLoyaltyTone()

### Community 69 - "webhook/route.ts"
Cohesion: 0.09
Nodes (30): stripe, handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), POST(), isCancellable() (+22 more)

### Community 70 - "card-deck.tsx"
Cohesion: 0.18
Nodes (14): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+6 more)

### Community 71 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 72 - "types.ts"
Cohesion: 0.16
Nodes (8): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, ProgramPreviewCard(), ScanResultCardPayload

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 75 - "caisse-scan.ts"
Cohesion: 0.11
Nodes (26): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, buildScanResult() (+18 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (6): ref_os, GET(), notFound(), config(), loadRoute(), PNG_BYTES

### Community 80 - "layout-shell.tsx"
Cohesion: 0.09
Nodes (18): recharts, AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget, ACTIVITY_LABELS, DashboardHome() (+10 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fidelo"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fidelo, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "seed.ts"
Cohesion: 0.27
Nodes (8): main(), prisma, requiredEnv(), upsertEmployee(), bcryptjs, main(), prisma, required()

### Community 85 - "merchant-card-renderer.tsx"
Cohesion: 0.13
Nodes (30): CardTemplateBackground(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps (+22 more)

### Community 86 - "vitest"
Cohesion: 0.09
Nodes (16): vitest, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser (+8 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "super-admin-session.ts"
Cohesion: 0.10
Nodes (24): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCampagnesPage(), SuperAdminCardsPage() (+16 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.05
Nodes (26): AD_STATUS_LABELS, addDaysToDateInput(), AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampagnesPanel(), CAMPAIGN_PRICE_CENTS (+18 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "ref_path"
Cohesion: 0.11
Nodes (15): ref_fs, ref_path, ref_vitest_config, main(), outDir, shot(), outDir, main() (+7 more)

### Community 102 - "rbac.ts"
Cohesion: 0.12
Nodes (23): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace(), assertCanAddEmployee() (+15 more)

### Community 103 - "program/route.ts"
Cohesion: 0.29
Nodes (8): GET(), sortOrder(), GET(), loadProgram(), PUT(), balanceFieldForUnit(), loyaltyDraftSchema, programSimulateSchema

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.16
Nodes (9): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 105 - "landing-header.tsx"
Cohesion: 0.29
Nodes (6): next-themes, MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "api-guard.ts"
Cohesion: 0.09
Nodes (31): zod, POST(), schema, POST(), schema, schema, dynamic, markReadSchema (+23 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "notifications-center.tsx"
Cohesion: 0.24
Nodes (8): DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter(), markOneRead(), openNotification()

### Community 118 - "employee-session.ts"
Cohesion: 0.17
Nodes (17): EmployeeLoginPage(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+9 more)

### Community 120 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 121 - "env.ts"
Cohesion: 0.14
Nodes (9): assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), env, getAllowedOrigins(), MerchantAppAccess (+1 more)

### Community 122 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.13
Nodes (15): baseCampaign, campaignFindFirst, campaignPaymentCreate, campaignUpdate, createCampaignCheckoutSession, estimateMerchantMembersAudience, estimateNetworkLocalAudience, FakeStripeNotConfiguredError (+7 more)

### Community 124 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 125 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 126 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 127 - "merchant-card-finish.test.ts"
Cohesion: 0.19
Nodes (16): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+8 more)

### Community 128 - "landing-hero-visual.tsx"
Cohesion: 0.33
Nodes (5): CoffeeIcon(), QrCodeIcon(), WalletCardsIcon(), WifiIcon(), LandingHeroVisual()

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.21
Nodes (15): log(), loop(), requestShutdown(), sleep(), backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete() (+7 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.27
Nodes (5): DiscoverPage(), Merchant, Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 132 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.20
Nodes (8): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 134 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 135 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 136 - "campaign-crud-routes.test.ts"
Cohesion: 0.22
Nodes (7): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 137 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 138 - "jsonError"
Cohesion: 0.08
Nodes (42): GET(), PATCH(), GET(), POST(), GET(), DELETE(), FILTER_MAP, GET() (+34 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "google-wallet-doctor.ts"
Cohesion: 0.24
Nodes (11): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert (+3 more)

### Community 141 - "getSessionUser"
Cohesion: 0.29
Nodes (8): dynamic, MerchantProfilePage(), dynamic, NotificationsPage(), ProEntryPage(), JoinMerchantPage(), getPublishedCardTemplate(), getSessionUser()

### Community 142 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 143 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 144 - "employees/[id]/route.ts"
Cohesion: 0.30
Nodes (12): GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST(), canExposeInvitationLinkInAdmin() (+4 more)

### Community 146 - "resolveLandingAuthTargets"
Cohesion: 0.40
Nodes (3): HomePage(), resolveLandingAuthTargets(), { getSessionUserMock, getEmployeeSessionMock }

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.11
Nodes (21): processCaisseScan(), assertQrUsable(), QrError, QrPayload, secretKey(), signQrToken(), verifyQrToken(), caisseGrantCreate (+13 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.26
Nodes (13): buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), createMembershipInvitation() (+5 more)

## Knowledge Gaps
- **761 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+756 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1027 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `@prisma/client` to `customer-reward-progress.ts`, `lib/campaign-worker.ts`, `scan/ui.tsx`, `cards-index.tsx`, `merchant-card-template-service.ts`, `loyalty-commit.ts`, `fife-life/merchant-detail.tsx`, `loyalty-widget.ts`, `jsonError`, `card-editor-canvas.tsx`, `jsonOk`, `getSessionUser`, `loyalty-reward-removal.ts`, `wallet-home.tsx`, `cn`, `events/route.ts`, `loyalty-service.ts`, `cashier-checkout.tsx`, `customer-loyalty-overview.ts`, `employee-invitation-service.ts`, `google-auth.ts`, `loyalty-labels.ts`, `session.ts`, `loyalty-program.ts`, `use-wallet-unlock-animation.ts`, `requireMerchantAdmin`, `card-editor.tsx`, `package.json`, `google-wallet.ts`, `card-editor-properties.tsx`, `loyalty-program-publication.ts`, `qa-login.ts`, `insight-stats.ts`, `resolvePublishedMerchantCardTemplate`, `demo-visual.ts`, `ref_next_link`, `loyalty-service.test.ts`, `platform-stats.ts`, `customer-history.ts`, `webhook/route.ts`, `types.ts`, `caisse-scan.ts`, `seed.ts`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `rbac.ts`, `program/route.ts`, `api-guard.ts`, `employee-session.ts`, `env.ts`, `customer-qr.ts`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `customer-reward-progress.ts`, `lib/campaign-worker.ts`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `customer-push-route.test.ts`, `react`, `super-admin-campaign-moderation.test.ts`, `card-template-schema.ts`, `campaign-crud-routes.test.ts`, `customer-qr-route.test.ts`, `loyalty-widget.ts`, `fife-life/merchant-detail.tsx`, `google-wallet-doctor.ts`, `push-client.ts`, `loyalty-reward-removal.ts`, `loyalty-service.ts`, `profile-shared.tsx`, `wallet-home.tsx`, `resolveLandingAuthTargets`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `customer-loyalty-overview.ts`, `google-auth.ts`, `isProduction`, `loyalty-labels.ts`, `cashier-checkout.tsx`, `loyalty-program.ts`, `use-wallet-unlock-animation.ts`, `requireMerchantAdmin`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `demo-session.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `card-editor-polish.test.ts`, `loyalty-program-publication.ts`, `qa-login.ts`, `ref_node_path`, `email.ts`, `insight-stats.ts`, `resolvePublishedMerchantCardTemplate`, `loyalty-service.test.ts`, `api-merchant-statistics-route.test.ts`, `platform-stats.ts`, `google-wallet-appearance.ts`, `@prisma/client`, `webhook/route.ts`, `card-deck.tsx`, `caisse-scan.ts`, `unsubscribe-token.ts`, `[kind]/route.ts`, `merchant-card-renderer.tsx`, `ref_path`, `rbac.ts`, `campaign-worker.test.ts`, `api-guard.ts`, `env.ts`, `campaign-confirm-route.test.ts`, `landing-page.test.ts`, `caisse-scan-route.test.ts`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `scan/ui.tsx`, `cards-index.tsx`, `merchant-card-template-service.ts`, `discover-page.tsx`, `landing-faq.tsx`, `fife-life/merchant-detail.tsx`, `loyalty-widget-view.tsx`, `profile-shared.tsx`, `card-editor-canvas.tsx`, `wallet-home.tsx`, `cn`, `use-media-query.ts`, `profile-page.tsx`, `cashier-checkout.tsx`, `loyalty-labels.ts`, `loyalty-program.ts`, `reward-form-dialog.tsx`, `use-wallet-unlock-animation.ts`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `card-editor-properties.tsx`, `interactive-loyalty-card.tsx`, `card-editor-polish.test.ts`, `qr-cache.ts`, `qa-login.ts`, `ref_next_link`, `@prisma/client`, `card-deck.tsx`, `merchants-list.tsx`, `types.ts`, `layout-shell.tsx`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `landing-header.tsx`, `notifications-center.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _761 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10160427807486631 - nodes in this community are weakly interconnected._
- **Should `scan/ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06378378378378378 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07188778492109878 - nodes in this community are weakly interconnected._