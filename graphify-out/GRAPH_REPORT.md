# Graph Report - Cartefidelité  (2026-09-23)

## Corpus Check
- 587 files · ~4,726,259 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 3122 nodes · 9653 edges · 144 communities (125 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af03da99`
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
- insight-period.ts
- card-editor-properties.tsx
- jsonOk
- loyalty-service.ts
- google-wallet/route.ts
- wallet-hydration.test.tsx
- cn
- events/route.ts
- outils/ui.tsx
- profile-page.tsx
- cashier-checkout.tsx
- customer-loyalty-overview.ts
- google-auth.ts
- env.ts
- loyalty-card-view-model.ts
- qa-login/page.tsx
- loyalty-program.ts
- advantages-ui.tsx
- campaign-quota.test.ts
- create-super-admin.ts
- requireMerchantAdmin
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- globalObjectBody
- demo-session.ts
- What You Must Do When Invoked
- media-storage.ts
- loyalty-commit.test.ts
- card-enlarged-view.tsx
- ref_fs_promises
- demo-routing.test.ts
- src/app/page.tsx
- compilerOptions
- wallet-home.tsx
- loyalty-program-publication.ts
- qa-login.ts
- ref_node_path
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- demo-visual.ts
- ref_next_link
- loyalty-service.test.ts
- scripts
- api-merchant-statistics-route.test.ts
- platform-stats.ts
- google-wallet-appearance.ts
- programme/ui.tsx
- @prisma/client
- webhook/route.ts
- card-deck.tsx
- merchants-list.tsx
- types.ts
- AdvantagesEditor
- caisse-scan.ts
- unsubscribe-token.ts
- EmployeeDetailPanel
- MerchantDetailPage
- [kind]/route.ts
- dashboard-home.tsx
- cartes.js
- Fidelo
- docker-entrypoint.sh
- qr.ts
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
- EmployeeLoginScreen
- campaign-confirm-route.test.ts
- customer-qr.ts
- landing-page.test.ts
- caisse-scan-route.test.ts
- merchant-card-finish.test.ts
- lib/campaign-worker.ts
- discover-page.tsx
- cards-index.tsx
- customer-push-route.test.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- landing-faq.tsx
- campaign-crud-routes.test.ts
- jsonError
- push-client.ts
- google-wallet-doctor.ts
- session.ts
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
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `configWithWidget()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/loyalty-widget.test.tsx → src/lib/card-template-schema.ts
- `mockLoyaltyContext()` --calls--> `progressTargetForBalance()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-context.ts
- `mockLoyaltyContext()` --calls--> `loyaltyUnitForMode()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-labels.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (144 total, 19 thin omitted)

### Community 0 - "customer-reward-progress.ts"
Cohesion: 0.15
Nodes (22): MerchantRewardProgressPanel(), TargetBlock(), buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT (+14 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.11
Nodes (20): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CARD_ASPECT_RATIO, CARD_SCHEMA_VERSION, QR_MIN_SIZE, CardDecorativeStyle (+12 more)

### Community 2 - "scan/ui.tsx"
Cohesion: 0.06
Nodes (56): GET(), ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeScanPage(), EmployeeProfile, EmployeeScanScreen(), Phase (+48 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (62): GET(), GET(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath() (+54 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.09
Nodes (26): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), EmployeeInvitationScreen(), ChangePasswordPage(), LOYALTY_MODES (+18 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.12
Nodes (35): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction() (+27 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.25
Nodes (20): ref_next_navigation, CampagnesPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), OutilsPage() (+12 more)

### Community 8 - "fife-life/merchant-detail.tsx"
Cohesion: 0.09
Nodes (17): ref_react_dom_server, AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink() (+9 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (34): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+26 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.09
Nodes (42): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), publishValidationResult(), CardLoyaltyWidgetConfig (+34 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (50): DELETE(), POST(), GET(), POST(), GET(), POST(), GET(), GET() (+42 more)

### Community 12 - "insight-period.ts"
Cohesion: 0.23
Nodes (20): addParisDays(), addParisMonths(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey (+12 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (62): elementShellStyle(), ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine (+54 more)

### Community 14 - "jsonOk"
Cohesion: 0.11
Nodes (66): POST(), POST(), POST(), POST(), POST(), POST(), logScanBody(), POST() (+58 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.14
Nodes (22): availableRewardModules(), buildGoogleWalletMerchantView(), loyaltyPointLabel(), merchantObjectBody(), textModule(), applyAdjustment(), applyEarnVisit(), applyRedeemReward() (+14 more)

### Community 16 - "google-wallet/route.ts"
Cohesion: 0.09
Nodes (41): GET(), POST(), POST(), dynamic, logCustomerQr(), POST(), runtime, schema (+33 more)

### Community 17 - "wallet-hydration.test.tsx"
Cohesion: 0.15
Nodes (16): ref_motion_react, react-dom, ref_react_dom_client, ExpandableQrCode(), handleActivate(), openQr(), ExpandableQrCodeProps, NewCardToast() (+8 more)

### Community 18 - "cn"
Cohesion: 0.09
Nodes (29): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel() (+21 more)

### Community 19 - "events/route.ts"
Cohesion: 0.19
Nodes (15): POST(), dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk() (+7 more)

### Community 20 - "outils/ui.tsx"
Cohesion: 0.29
Nodes (5): FidelisationPanel(), icons, OutilsPanel(), TOOLS, ToolCard()

### Community 21 - "profile-page.tsx"
Cohesion: 0.07
Nodes (36): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+28 more)

### Community 22 - "cashier-checkout.tsx"
Cohesion: 0.10
Nodes (33): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+25 more)

### Community 23 - "customer-loyalty-overview.ts"
Cohesion: 0.13
Nodes (30): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, activityFromWalletEvent() (+22 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "env.ts"
Cohesion: 0.08
Nodes (25): ref_next_server, assertSameOrigin(), CsrfError, env, getAllowedOrigins(), isProduction(), hostnameOf(), isAdminHost() (+17 more)

### Community 26 - "loyalty-card-view-model.ts"
Cohesion: 0.18
Nodes (13): DEMO_TIER_DECK_ORDER, getLoyaltyCardTierLabel(), LOYALTY_CARD_BACKGROUNDS, LOYALTY_CARD_TIER_LABELS, LoyaltyCardTierKey, WALLET_TIER_TO_CARD_KEY, walletTierToCardKey(), buildLoyaltyCardViewModel() (+5 more)

### Community 27 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 28 - "loyalty-program.ts"
Cohesion: 0.10
Nodes (33): assertEarnProgramRules(), block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes() (+25 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.16
Nodes (15): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+7 more)

### Community 30 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "requireMerchantAdmin"
Cohesion: 0.18
Nodes (29): POST(), POST(), GET(), GET(), POST(), serializeCampaign(), requireMerchantAdmin(), AudienceEstimate (+21 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.08
Nodes (44): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+36 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (31): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+23 more)

### Community 37 - "globalObjectBody"
Cohesion: 0.32
Nodes (12): appLinkData(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData(), isPublicHttpsImageUrl(), localized() (+4 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.19
Nodes (16): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), applyDemoRoleCookies() (+8 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.15
Nodes (24): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, deleteCardBackgroundIfUnused() (+16 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "card-enlarged-view.tsx"
Cohesion: 0.08
Nodes (37): CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveCardShell() (+29 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.11
Nodes (15): ref_fs_promises, ref_sharp, OUT, tiers, files, INPUT_DIR, GET(), MIME (+7 more)

### Community 45 - "demo-routing.test.ts"
Cohesion: 0.12
Nodes (19): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled() (+11 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.11
Nodes (25): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+17 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-home.tsx"
Cohesion: 0.11
Nodes (34): DiscoverIconLink(), NotificationBellLink(), WalletEventPayload, useWalletEvents(), connect(), disconnect(), onVisibility(), isDocumentVisible() (+26 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (29): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken() (+21 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (39): ref_node_buffer, ref_node_fs, ref_node_fs_promises, ref_node_path, ref_node_url, ref_node_zlib, playwright, OUT (+31 more)

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
Cohesion: 0.10
Nodes (36): bucketKey(), InsightRange, percentChange(), buildCohorts(), buildComparison(), buildFinancial(), buildFrequentation(), buildOverview() (+28 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.14
Nodes (23): CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_CARDS, PREVIEW_PREFERENCES, PREVIEW_PROFILE, PREVIEW_PROFILE_HISTORY (+15 more)

### Community 60 - "ref_next_link"
Cohesion: 0.10
Nodes (14): ref_next_link, HomeStats, QUICK_ACTIONS, StatsPreview, TrendMetric, SPACES, COLUMNS, isInternalPath() (+6 more)

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

### Community 66 - "programme/ui.tsx"
Cohesion: 0.17
Nodes (13): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+5 more)

### Community 67 - "@prisma/client"
Cohesion: 0.16
Nodes (20): @prisma/client, formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), getActiveMerchantLoyaltyContextBySlug(), isMerchantOperational() (+12 more)

### Community 69 - "webhook/route.ts"
Cohesion: 0.09
Nodes (30): stripe, handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), POST(), isCancellable() (+22 more)

### Community 70 - "card-deck.tsx"
Cohesion: 0.18
Nodes (13): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+5 more)

### Community 71 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 72 - "types.ts"
Cohesion: 0.14
Nodes (10): CardsSheet(), LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList() (+2 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 75 - "caisse-scan.ts"
Cohesion: 0.25
Nodes (11): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScanByClientNumber(), deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber() (+3 more)

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

### Community 80 - "dashboard-home.tsx"
Cohesion: 0.18
Nodes (9): recharts, ACTIVITY_LABELS, DashboardHome(), Overview, QUICK_LINKS, PlatformChart(), Point, StatCard() (+1 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fidelo"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fidelo, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "qr.ts"
Cohesion: 0.25
Nodes (11): main(), prisma, requiredEnv(), upsertEmployee(), processCaisseScan(), assertQrUsable(), QrError, QrPayload (+3 more)

### Community 85 - "merchant-card-renderer.tsx"
Cohesion: 0.14
Nodes (31): COMPACT_HIDDEN, displayClientName(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc(), shouldHideElement() (+23 more)

### Community 86 - "vitest"
Cohesion: 0.07
Nodes (21): vitest, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser (+13 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "super-admin-session.ts"
Cohesion: 0.06
Nodes (33): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), AdRequest, CampaignModerationHome() (+25 more)

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
Cohesion: 0.10
Nodes (26): CaissePage(), DashboardLayout(), heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS (+18 more)

### Community 103 - "program/route.ts"
Cohesion: 0.29
Nodes (8): GET(), sortOrder(), GET(), loadProgram(), PUT(), balanceFieldForUnit(), loyaltyDraftSchema, programSimulateSchema

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.15
Nodes (10): ref_next_font_google, next-themes, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister() (+2 more)

### Community 105 - "landing-header.tsx"
Cohesion: 0.33
Nodes (5): MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

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
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 118 - "employee-session.ts"
Cohesion: 0.15
Nodes (19): EmployeeLoginPage(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+11 more)

### Community 120 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

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
Cohesion: 0.27
Nodes (12): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+4 more)

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

### Community 138 - "jsonError"
Cohesion: 0.08
Nodes (42): GET(), PATCH(), GET(), POST(), GET(), DELETE(), FILTER_MAP, GET() (+34 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "google-wallet-doctor.ts"
Cohesion: 0.46
Nodes (7): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl()

### Community 141 - "session.ts"
Cohesion: 0.18
Nodes (11): GET(), dynamic, MerchantProfilePage(), ProEntryPage(), SPACES, JoinMerchantPage(), getPublishedCardTemplate(), getRequestUser() (+3 more)

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
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.19
Nodes (16): employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR (+8 more)

## Knowledge Gaps
- **761 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+756 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1027 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `@prisma/client` to `customer-reward-progress.ts`, `lib/campaign-worker.ts`, `scan/ui.tsx`, `cards-index.tsx`, `merchant-card-template-service.ts`, `loyalty-commit.ts`, `loyalty-widget.ts`, `jsonError`, `card-editor-properties.tsx`, `jsonOk`, `session.ts`, `loyalty-service.ts`, `loyalty-reward-removal.ts`, `events/route.ts`, `profile-page.tsx`, `cashier-checkout.tsx`, `customer-loyalty-overview.ts`, `employee-invitation-service.ts`, `google-auth.ts`, `env.ts`, `loyalty-program.ts`, `advantages-ui.tsx`, `create-super-admin.ts`, `requireMerchantAdmin`, `card-editor.tsx`, `package.json`, `wallet-home.tsx`, `loyalty-program-publication.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `ref_next_link`, `loyalty-service.test.ts`, `platform-stats.ts`, `programme/ui.tsx`, `webhook/route.ts`, `types.ts`, `qr.ts`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `rbac.ts`, `program/route.ts`, `api-guard.ts`, `employee-session.ts`, `customer-qr.ts`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `customer-reward-progress.ts`, `lib/campaign-worker.ts`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `customer-push-route.test.ts`, `react`, `loyalty-commit.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-crud-routes.test.ts`, `fife-life/merchant-detail.tsx`, `loyalty-widget.ts`, `push-client.ts`, `insight-period.ts`, `card-editor-properties.tsx`, `loyalty-reward-removal.ts`, `loyalty-service.ts`, `loyalty-widget-view.tsx`, `wallet-hydration.test.tsx`, `resolveLandingAuthTargets`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `customer-loyalty-overview.ts`, `google-auth.ts`, `cashier-checkout.tsx`, `env.ts`, `profile-page.tsx`, `loyalty-program.ts`, `campaign-quota.test.ts`, `requireMerchantAdmin`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `demo-routing.test.ts`, `wallet-home.tsx`, `loyalty-program-publication.ts`, `qa-login.ts`, `ref_node_path`, `email.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `api-merchant-statistics-route.test.ts`, `platform-stats.ts`, `google-wallet-appearance.ts`, `@prisma/client`, `webhook/route.ts`, `card-deck.tsx`, `caisse-scan.ts`, `unsubscribe-token.ts`, `[kind]/route.ts`, `qr.ts`, `merchant-card-renderer.tsx`, `ref_path`, `rbac.ts`, `campaign-worker.test.ts`, `api-guard.ts`, `campaign-confirm-route.test.ts`, `landing-page.test.ts`, `caisse-scan-route.test.ts`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `customer-reward-progress.ts`, `card-template-schema.ts`, `scan/ui.tsx`, `cards-index.tsx`, `merchant-card-template-service.ts`, `discover-page.tsx`, `landing-faq.tsx`, `fife-life/merchant-detail.tsx`, `loyalty-widget-view.tsx`, `card-editor-properties.tsx`, `wallet-hydration.test.tsx`, `cn`, `use-media-query.ts`, `profile-page.tsx`, `cashier-checkout.tsx`, `qa-login/page.tsx`, `advantages-ui.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `card-enlarged-view.tsx`, `wallet-home.tsx`, `ref_next_link`, `programme/ui.tsx`, `@prisma/client`, `card-deck.tsx`, `merchants-list.tsx`, `types.ts`, `dashboard-home.tsx`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `landing-header.tsx`, `notifications-center.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _761 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10507246376811594 - nodes in this community are weakly interconnected._
- **Should `scan/ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06378378378378378 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06050228310502283 - nodes in this community are weakly interconnected._