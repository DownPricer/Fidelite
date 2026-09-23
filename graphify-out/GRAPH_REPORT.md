# Graph Report - Cartefidelité  (2026-09-23)

## Corpus Check
- 587 files · ~4,725,818 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 3120 nodes · 9654 edges · 153 communities (133 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee0a3169`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- loyalty-labels.ts
- card-template-schema.ts
- scan/ui.tsx
- merchant-card-template-service.ts
- next
- components/ui.tsx
- loyalty-commit.ts
- firstActiveStaffMembership
- statistics/route.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- jsonOk
- card-editor-canvas.tsx
- jsonError
- loyalty-service.ts
- isGoogleWalletConfigured
- card-enlarged-view.tsx
- cn
- requireUser
- ref_next_navigation
- profile-page.tsx
- money.ts
- wallet-home.tsx
- google-auth.ts
- env.ts
- loyalty-context.ts
- avatar-editor.tsx
- loyalty-program.ts
- advantages-ui.tsx
- use-wallet-unlock-animation.ts
- app/statistiques/page.tsx
- campaigns/[id]/confirm/route.ts
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- buildGoogleWalletMerchantView
- demo-session.ts
- What You Must Do When Invoked
- card-editor-properties.tsx
- media-storage.ts
- loyalty-commit.test.ts
- card-deck.tsx
- ref_fs_promises
- employee-demo-server.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- loyalty-program-publication.ts
- qr-cache.ts
- qa-login.ts
- ref_node_path
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- resolvePublishedMerchantCardTemplate
- demo-visual.ts
- ref_next_link
- loyalty-service.test.ts
- scripts
- ref_next_server
- platform-stats.ts
- google-wallet/route.ts
- programme/ui.tsx
- vitest
- customer-history.ts
- webhook/route.ts
- card-deck-interaction.test.ts
- merchants-list.tsx
- types.ts
- AdvantagesEditor
- SettingsPage
- program/route.ts
- unsubscribe/route.ts
- EmployeeDetailPanel
- MerchantDetailPage
- campaign-quota.test.ts
- react
- cartes.js
- Fidelo
- docker-entrypoint.sh
- create-super-admin.ts
- merchant-card-renderer.tsx
- customer-preferences-route.test.ts
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
- customer-notifications-route.test.ts
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
- merchant-app-access.ts
- EmployeeLoginScreen
- campaign-confirm-route.test.ts
- verify-viewports.mjs
- landing-page.test.ts
- generate-pwa-icons.mjs
- super-admin.test.ts
- cashier-checkout.tsx
- lib/campaign-worker.ts
- discover-page.tsx
- cards-index.tsx
- scripts/campaign-worker.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- campaign-moderation-home.tsx
- campaign-crud-routes.test.ts
- ref_node_fs
- profile/route.ts
- push-client.ts
- google-wallet-doctor.ts
- getSessionUser
- @prisma/client
- landing-merchant-preview.tsx
- requireMerchantAdmin
- invitation/page.tsx
- resolveLandingAuthTargets
- MerchantHome
- avatar-storage.ts
- caisse-scan.ts
- employee-invitation-service.ts
- capture-super-admin.mjs
- campaign-audience.test.ts

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
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `mockLoyaltyContext()` --calls--> `progressTargetForBalance()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-context.ts
- `mockLoyaltyContext()` --calls--> `loyaltyUnitForMode()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-labels.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (153 total, 20 thin omitted)

### Community 0 - "loyalty-labels.ts"
Cohesion: 0.25
Nodes (14): MerchantRewardProgressPanel(), TargetBlock(), buildTargetView(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState (+6 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.10
Nodes (19): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+11 more)

### Community 2 - "scan/ui.tsx"
Cohesion: 0.07
Nodes (52): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+44 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.08
Nodes (49): LegacyCardEditorRedirect(), CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), cardSlotForLoyaltyMode(), isLoyaltyProgramSlot() (+41 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "components/ui.tsx"
Cohesion: 0.09
Nodes (25): Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), ChangePasswordPage(), SPACES, LOYALTY_MODES, STEPS (+17 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.14
Nodes (25): dynamic, GET(), getCustomerMerchantRewardProgress(), appliedTierLabel(), assembleView(), buildView(), customerName(), evaluateCustomerRewards() (+17 more)

### Community 7 - "firstActiveStaffMembership"
Cohesion: 0.30
Nodes (14): CampagnesPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), OutilsPage(), MerchantHomePage() (+6 more)

### Community 8 - "statistics/route.ts"
Cohesion: 0.24
Nodes (10): GET(), GET(), PERIOD_KEYS, requireMerchantStatsAccess(), staffContext(), src_lib_google_wallet_isgooglewalletconfigured, getFreeMerchantStats(), getHomeStats() (+2 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (34): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetView(), pct(), ProgressCircle() (+26 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (50): ref_react_dom_server, LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+42 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (35): FILTER_MAP, GET(), POST(), formatFifeLifeEntry(), acceptInvitationSchema, adModerationSchema, adRequestCreateSchema, avatarUploadSchema (+27 more)

### Community 12 - "jsonOk"
Cohesion: 0.11
Nodes (33): zod, GET(), markReadSchema, GET(), GET(), GET(), GET(), PATCH() (+25 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.10
Nodes (46): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+38 more)

### Community 14 - "jsonError"
Cohesion: 0.10
Nodes (68): GET(), PATCH(), GET(), POST(), POST(), POST(), POST(), POST() (+60 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.33
Nodes (10): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), computeLoyalty(), LoyaltyError, LoyaltySnapshot, ApplyLoyaltyInput, LoyaltyDb (+2 more)

### Community 16 - "isGoogleWalletConfigured"
Cohesion: 0.64
Nodes (6): POST(), POST(), requireStandardUser(), isGoogleWalletConfigured(), publicGoogleWalletError(), jsonOkPrivate()

### Community 17 - "card-enlarged-view.tsx"
Cohesion: 0.14
Nodes (19): ref_motion_react, react-dom, ref_react_dom_client, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), ExpandableQrCode(), handleActivate() (+11 more)

### Community 18 - "cn"
Cohesion: 0.09
Nodes (29): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel() (+21 more)

### Community 19 - "requireUser"
Cohesion: 0.10
Nodes (30): GET(), DELETE(), dynamic, GET(), GET(), PATCH(), POST(), dynamic (+22 more)

### Community 20 - "ref_next_navigation"
Cohesion: 0.22
Nodes (10): ref_next_navigation, FidelisationPanel(), icons, OutilsPanel(), TOOLS, SettingsPanel(), MerchantPageHeader(), MerchantPageShell() (+2 more)

### Community 21 - "profile-page.tsx"
Cohesion: 0.15
Nodes (22): GlassBottomSheet(), SheetAction(), HistoryFilter, ProfilePage(), patchProfile(), saveNameEdit(), APP_VERSION, APPEARANCE_OPTIONS (+14 more)

### Community 22 - "money.ts"
Cohesion: 0.15
Nodes (20): AmountField(), press(), KEYS, RewardConfig, evaluateReward(), parseRewardConditions(), RewardConditions, rewardIsStackable() (+12 more)

### Community 23 - "wallet-home.tsx"
Cohesion: 0.07
Nodes (37): AddToGoogleWalletButton(), CardsSheet(), DiscoverIconLink(), NotificationBellLink(), CustomerProgramView, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink() (+29 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "env.ts"
Cohesion: 0.11
Nodes (22): assertSameOrigin(), CsrfError, env, getAllowedOrigins(), isProduction(), hostnameOf(), isAdminHost(), isAppHost() (+14 more)

### Community 26 - "loyalty-context.ts"
Cohesion: 0.18
Nodes (23): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), ActiveMerchantLoyaltyContext, buildCustomerProgramView(), getActiveMerchantLoyaltyContextBySlug(), isMerchantOperational() (+15 more)

### Community 27 - "avatar-editor.tsx"
Cohesion: 0.47
Nodes (5): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor()

### Community 28 - "loyalty-program.ts"
Cohesion: 0.10
Nodes (33): assertEarnProgramRules(), assertEvaluationOk(), block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn() (+25 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.15
Nodes (16): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+8 more)

### Community 30 - "use-wallet-unlock-animation.ts"
Cohesion: 0.20
Nodes (17): isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), hasRenderReadyTemplate(), cardFromUnlockPayload(), fetchUnlockCardDetail(), isUnlockCardReadyForReveal() (+9 more)

### Community 31 - "app/statistiques/page.tsx"
Cohesion: 0.20
Nodes (8): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), canViewStatistics(), admin, cashier, grantedCashier, manager

### Community 32 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.17
Nodes (28): POST(), POST(), GET(), GET(), POST(), serializeCampaign(), AudienceEstimate, estimatedForChannel() (+20 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.09
Nodes (35): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+27 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.08
Nodes (34): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+26 more)

### Community 37 - "buildGoogleWalletMerchantView"
Cohesion: 0.28
Nodes (16): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData() (+8 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.11
Nodes (27): ref_next_headers, GET(), GET(), GET(), GET(), GET(), CLIENT_DEMO_COOKIE, isClientDemoMode() (+19 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "card-editor-properties.tsx"
Cohesion: 0.15
Nodes (18): REQUIRED_BY_SLOT, TEXT_TYPES, BACKGROUND_FIT_LABELS, containsForbiddenTechnicalLabel(), DATA_KEY_LABELS, dataKeyLabel(), FIT_MODE_LABELS, FONT_FAMILY_LABELS (+10 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.15
Nodes (24): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, deleteCardBackgroundIfUnused() (+16 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "card-deck.tsx"
Cohesion: 0.08
Nodes (35): activeCardFromDeck(), CardDeck(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex(), readDeckMetrics() (+27 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.12
Nodes (14): ref_fs_promises, ref_os, OUT, tiers, GET(), MIME, GET(), MIME (+6 more)

### Community 45 - "employee-demo-server.ts"
Cohesion: 0.28
Nodes (8): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, src_lib_employee_demo_employee_demo_cookie, isEmployeeDemoCookie(), isEmployeeDevDemo(), resolveEmployeeDemo()

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (29): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+21 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.17
Nodes (21): WalletEventPayload, useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard() (+13 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "qr-cache.ts"
Cohesion: 0.13
Nodes (20): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce (+12 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (36): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken() (+28 more)

### Community 52 - "ref_node_path"
Cohesion: 0.07
Nodes (19): ref_node_fs_promises, ref_node_path, playwright, OUT, OUT, shots, outDir, goto() (+11 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.16
Nodes (31): accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue(), ensureGlobalClassRecord() (+23 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (14): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+6 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.08
Nodes (55): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+47 more)

### Community 58 - "resolvePublishedMerchantCardTemplate"
Cohesion: 0.20
Nodes (13): GET(), logMerchantCardSwitch(), MerchantCardSwitchContext, MerchantCardSwitchStep, findPublishedForSlot(), normalizeResolvedPublishedTemplate(), resolvePublishedMerchantCardTemplate(), mergeMerchantCardUpdate() (+5 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.16
Nodes (15): CarteIdentitePage(), PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, src_lib_demo_visual_client_demo_cookie, DEMO_EMAIL, DEMO_FIRST_NAME, DEMO_FULL_NAME (+7 more)

### Community 60 - "ref_next_link"
Cohesion: 0.12
Nodes (9): ref_next_link, SPACES, COLUMNS, isInternalPath(), LandingFooter(), MerchantCardsGallery(), slotStatusLabel(), slotTone() (+1 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "ref_next_server"
Cohesion: 0.10
Nodes (13): ref_next_server, findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM (+5 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.24
Nodes (14): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+6 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.14
Nodes (24): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+16 more)

### Community 66 - "programme/ui.tsx"
Cohesion: 0.15
Nodes (15): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+7 more)

### Community 67 - "vitest"
Cohesion: 0.19
Nodes (14): vitest, formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), modeTitle(), programEarnDescription() (+6 more)

### Community 68 - "customer-history.ts"
Cohesion: 0.32
Nodes (6): BenefitEntry, formatLoyaltyEntry(), HistoryCategory, HistoryEntry, mapLoyaltyCategory(), mapLoyaltyTone()

### Community 69 - "webhook/route.ts"
Cohesion: 0.09
Nodes (30): stripe, handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), POST(), isCancellable() (+22 more)

### Community 70 - "card-deck-interaction.test.ts"
Cohesion: 0.43
Nodes (4): handleCardExpand(), CARD_NO_EXPAND_SELECTOR, shouldIgnoreCardExpand(), shouldProceedWithCardExpand()

### Community 71 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 72 - "types.ts"
Cohesion: 0.16
Nodes (8): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList(), ScanResultCardPayload

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 75 - "program/route.ts"
Cohesion: 0.11
Nodes (29): main(), dynamic, GET(), dynamic, GET(), GET(), GET(), sortOrder() (+21 more)

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.20
Nodes (12): jose, bodySchema, POST(), secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError (+4 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 80 - "react"
Cohesion: 0.11
Nodes (15): react, recharts, ACTIVITY_LABELS, Overview, QUICK_LINKS, NAV, SuperAdminShell(), PlatformChart() (+7 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fidelo"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fidelo, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 85 - "merchant-card-renderer.tsx"
Cohesion: 0.15
Nodes (26): LoyaltyWidgetProgressInput, COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps (+18 more)

### Community 86 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "super-admin-session.ts"
Cohesion: 0.09
Nodes (27): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCampagnesPage(), SuperAdminCardsPage() (+19 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.05
Nodes (26): AD_STATUS_LABELS, addDaysToDateInput(), AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampagnesPanel(), CAMPAIGN_PRICE_CENTS (+18 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "ref_path"
Cohesion: 0.09
Nodes (18): ref_fs, ref_path, ref_sharp, ref_vitest_config, main(), outDir, shot(), outDir (+10 more)

### Community 102 - "rbac.ts"
Cohesion: 0.22
Nodes (11): assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canManageEmployees(), canViewAllCustomers(), MAX_ACTIVE_EMPLOYEES, staffHasPermission(), hasPermission() (+3 more)

### Community 103 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.22
Nodes (7): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister()

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
Nodes (35): schema, POST(), POST(), GET(), schema, GET(), DELETE(), GET() (+27 more)

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
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 118 - "employee-session.ts"
Cohesion: 0.20
Nodes (15): EmployeeLoginPage(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+7 more)

### Community 120 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 121 - "merchant-app-access.ts"
Cohesion: 0.24
Nodes (11): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, MerchantAppAccess, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+3 more)

### Community 122 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.13
Nodes (15): baseCampaign, campaignFindFirst, campaignPaymentCreate, campaignUpdate, createCampaignCheckoutSession, estimateMerchantMembersAudience, estimateNetworkLocalAudience, FakeStripeNotConfiguredError (+7 more)

### Community 125 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 126 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 127 - "super-admin.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 128 - "cashier-checkout.tsx"
Cohesion: 0.23
Nodes (13): CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase, RewardCard(), statusClass(), commitCaisseTransaction() (+5 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.26
Nodes (12): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+4 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.27
Nodes (5): DiscoverPage(), Merchant, Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 132 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.20
Nodes (8): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 134 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 135 - "campaign-moderation-home.tsx"
Cohesion: 0.25
Nodes (5): AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 136 - "campaign-crud-routes.test.ts"
Cohesion: 0.22
Nodes (7): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 137 - "ref_node_fs"
Cohesion: 0.11
Nodes (10): ref_node_fs, outDir, outDir, generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug (+2 more)

### Community 138 - "profile/route.ts"
Cohesion: 0.40
Nodes (10): GET(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_PROFILE_HISTORY, ensureCustomerPreferences(), getProfileUser(), serializePreferences() (+2 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "google-wallet-doctor.ts"
Cohesion: 0.39
Nodes (8): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl()

### Community 141 - "getSessionUser"
Cohesion: 0.42
Nodes (6): dynamic, MerchantProfilePage(), ProEntryPage(), JoinMerchantPage(), getPublishedCardTemplate(), getSessionUser()

### Community 142 - "@prisma/client"
Cohesion: 0.43
Nodes (5): @prisma/client, decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 143 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 144 - "requireMerchantAdmin"
Cohesion: 0.13
Nodes (27): GET(), GET(), POST(), GET(), GET(), POST(), GET(), mapEmployee() (+19 more)

### Community 146 - "resolveLandingAuthTargets"
Cohesion: 0.40
Nodes (3): HomePage(), resolveLandingAuthTargets(), { getSessionUserMock, getEmployeeSessionMock }

### Community 148 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

### Community 149 - "caisse-scan.ts"
Cohesion: 0.05
Nodes (55): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, dynamic, logCustomerQr(), POST() (+47 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.15
Nodes (20): employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR (+12 more)

## Knowledge Gaps
- **759 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+754 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1025 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `@prisma/client` to `cashier-checkout.tsx`, `lib/campaign-worker.ts`, `loyalty-labels.ts`, `cards-index.tsx`, `merchant-card-template-service.ts`, `scan/ui.tsx`, `loyalty-commit.ts`, `loyalty-widget.ts`, `profile/route.ts`, `jsonOk`, `card-editor-canvas.tsx`, `jsonError`, `getSessionUser`, `requireMerchantAdmin`, `loyalty-service.ts`, `requireUser`, `caisse-scan.ts`, `employee-invitation-service.ts`, `wallet-home.tsx`, `google-auth.ts`, `money.ts`, `loyalty-context.ts`, `loyalty-program.ts`, `advantages-ui.tsx`, `use-wallet-unlock-animation.ts`, `campaigns/[id]/confirm/route.ts`, `card-editor.tsx`, `package.json`, `card-editor-properties.tsx`, `loyalty-program-publication.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `resolvePublishedMerchantCardTemplate`, `ref_next_link`, `loyalty-service.test.ts`, `platform-stats.ts`, `programme/ui.tsx`, `vitest`, `customer-history.ts`, `webhook/route.ts`, `types.ts`, `program/route.ts`, `create-super-admin.ts`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `rbac.ts`, `api-guard.ts`, `employee-session.ts`, `merchant-app-access.ts`, `super-admin.test.ts`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `loyalty-labels.ts`, `lib/campaign-worker.ts`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `components/ui.tsx`, `super-admin-campaign-moderation.test.ts`, `campaign-crud-routes.test.ts`, `ref_node_fs`, `loyalty-widget.ts`, `statistics/route.ts`, `push-client.ts`, `card-editor-canvas.tsx`, `@prisma/client`, `loyalty-service.ts`, `requireMerchantAdmin`, `card-enlarged-view.tsx`, `resolveLandingAuthTargets`, `caisse-scan.ts`, `employee-invitation-service.ts`, `wallet-home.tsx`, `campaign-audience.test.ts`, `google-auth.ts`, `loyalty-context.ts`, `money.ts`, `loyalty-program.ts`, `env.ts`, `use-wallet-unlock-animation.ts`, `app/statistiques/page.tsx`, `campaigns/[id]/confirm/route.ts`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `demo-session.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `ref_fs_promises`, `loyalty-widget-view.tsx`, `loyalty-program-publication.ts`, `qr-cache.ts`, `qa-login.ts`, `email.ts`, `insight-stats.ts`, `resolvePublishedMerchantCardTemplate`, `loyalty-service.test.ts`, `ref_next_server`, `platform-stats.ts`, `google-wallet/route.ts`, `webhook/route.ts`, `card-deck-interaction.test.ts`, `program/route.ts`, `unsubscribe/route.ts`, `campaign-quota.test.ts`, `react`, `merchant-card-renderer.tsx`, `customer-preferences-route.test.ts`, `ref_path`, `rbac.ts`, `customer-notifications-route.test.ts`, `campaign-worker.test.ts`, `merchant-app-access.ts`, `campaign-confirm-route.test.ts`, `landing-page.test.ts`, `super-admin.test.ts`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `cashier-checkout.tsx`, `loyalty-labels.ts`, `scan/ui.tsx`, `cards-index.tsx`, `merchant-card-template-service.ts`, `components/ui.tsx`, `discover-page.tsx`, `campaign-moderation-home.tsx`, `card-template-schema.ts`, `loyalty-widget-view.tsx`, `card-editor-canvas.tsx`, `invitation/page.tsx`, `cn`, `card-enlarged-view.tsx`, `ref_next_navigation`, `profile-page.tsx`, `wallet-home.tsx`, `avatar-editor.tsx`, `advantages-ui.tsx`, `use-wallet-unlock-animation.ts`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `card-editor-properties.tsx`, `card-deck.tsx`, `src/app/page.tsx`, `wallet-event-dedup.ts`, `qr-cache.ts`, `qa-login.ts`, `ref_next_link`, `programme/ui.tsx`, `vitest`, `merchants-list.tsx`, `types.ts`, `merchant-card-renderer.tsx`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `landing-header.tsx`, `notifications-center.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _759 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10153846153846154 - nodes in this community are weakly interconnected._
- **Should `scan/ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06905370843989769 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07597402597402597 - nodes in this community are weakly interconnected._