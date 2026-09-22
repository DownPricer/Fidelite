# Graph Report - Cartefidelité  (2026-09-21)

## Corpus Check
- 518 files · ~4,689,687 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 2693 nodes · 8449 edges · 119 communities (102 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `34dfe8f6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- jsonError
- ref_node_path
- scan/ui.tsx
- merchant-card-template-service.ts
- super-admin-session.ts
- react
- google-wallet.ts
- ref_next_navigation
- use-wallet-unlock-animation.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- requireMutatingRequest
- interactive-loyalty-card.tsx
- @prisma/client
- validation.ts
- loyalty-context.ts
- prisma.ts
- card-enlarged-view.tsx
- cn
- getEmployeeSession
- platform-stats.ts
- demo-visual.ts
- fife-life/merchant-detail.tsx
- money.ts
- google-auth.ts
- ref_next_server
- writeAudit
- profile-page.tsx
- loyalty-commit.ts
- merchant-card-renderer.tsx
- card-template-schema.ts
- ProgramConfigurator
- jsonOk
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- super-admin.test.ts
- employee-session.ts
- What You Must Do When Invoked
- LoyaltyError
- media-storage.ts
- loyalty-commit.test.ts
- env.ts
- vitest
- demo-mode.ts
- src/app/page.tsx
- compilerOptions
- customer-loyalty-overview.ts
- loyalty-program-publication.ts
- qr-cache.ts
- qa-login.ts
- caisse-scan.ts
- dependencies
- syncGoogleWalletMembershipObject
- email.ts
- devDependencies
- insight-stats.ts
- caisse-scan.test.ts
- card-deck.tsx
- types.ts
- loyalty-service.test.ts
- scripts
- [kind]/route.ts
- next
- google-wallet/route.ts
- MerchantDetailPage
- src/app/layout.tsx
- EmployeeDetailPanel
- qr.ts
- generate-pwa-icons.mjs
- [id]/merchant-detail.tsx
- customer-qr.ts
- isGoogleWalletConfigured
- landing-header.tsx
- loyaltyBalanceForMode
- qa-login/page.tsx
- insight-period.ts
- google-wallet-doctor.ts
- trim-card-images.mjs
- caisse-scan-route.test.ts
- cartes.js
- Fidelo
- docker-entrypoint.sh
- create-super-admin.ts
- parametres/ui.tsx
- CreateMerchantWizard
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- app/ui.tsx
- progress-ring.tsx
- semi-gauge.tsx
- use-media-query.ts
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- program/route.ts
- landing-faq.tsx
- api-merchant-statistics-route.test.ts
- customer-qr-route.test.ts
- insight-permissions.test.ts
- graphify reference: query, path, explain
- landing-footer.tsx
- employee-invitation-service.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- landing-merchant-preview.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- insight-definitions.ts

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 148 edges
2. `jsonOk()` - 130 edges
3. `requireMutatingRequest()` - 91 edges
4. `react` - 87 edges
5. `prisma` - 85 edges
6. `@prisma/client` - 80 edges
7. `clientIp()` - 74 edges
8. `vitest` - 72 edges
9. `userAgent()` - 70 edges
10. `writeAudit()` - 62 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `configWithWidget()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/loyalty-widget.test.tsx → src/lib/card-template-schema.ts
- `legacyTemplateWithoutQr()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/wallet-hydration.test.tsx → src/lib/card-template-schema.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (119 total, 17 thin omitted)

### Community 0 - "jsonError"
Cohesion: 0.09
Nodes (42): GET(), PATCH(), GET(), POST(), GET(), DELETE(), FILTER_MAP, GET() (+34 more)

### Community 1 - "ref_node_path"
Cohesion: 0.04
Nodes (36): ref_node_fs, ref_node_fs_promises, ref_node_path, playwright, OUT, shots, OUT, OUT (+28 more)

### Community 2 - "scan/ui.tsx"
Cohesion: 0.05
Nodes (65): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+57 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (62): LegacyCardEditorRedirect(), CardEditorVariantRoute(), MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass(), defaultCardTemplateConfig(), ALL_MERCHANT_CARD_SLOTS (+54 more)

### Community 4 - "super-admin-session.ts"
Cohesion: 0.05
Nodes (45): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), ALL_SLOTS (+37 more)

### Community 5 - "react"
Cohesion: 0.08
Nodes (28): ref_next_link, react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), SPACES, EmployeeInvitationScreen() (+20 more)

### Community 6 - "google-wallet.ts"
Cohesion: 0.21
Nodes (23): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), GoogleWalletImage (+15 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.10
Nodes (39): ref_next_navigation, CaissePage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), DashboardLayout(), MerchantHomePage() (+31 more)

### Community 8 - "use-wallet-unlock-animation.ts"
Cohesion: 0.09
Nodes (42): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), useWalletEvents() (+34 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.10
Nodes (21): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct(), ProgressCircle() (+13 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.09
Nodes (45): buildElementCatalog(), LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+37 more)

### Community 11 - "requireMutatingRequest"
Cohesion: 0.16
Nodes (36): POST(), POST(), POST(), POST(), logScanBody(), POST(), scanVia(), POST() (+28 more)

### Community 12 - "interactive-loyalty-card.tsx"
Cohesion: 0.12
Nodes (20): InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, TIER_STYLE, WalletTier, formatClientNumberDisplay(), DEMO_TIER_DECK_ORDER, getLoyaltyCardBackground() (+12 more)

### Community 13 - "@prisma/client"
Cohesion: 0.07
Nodes (67): @prisma/client, ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine (+59 more)

### Community 14 - "validation.ts"
Cohesion: 0.06
Nodes (45): zod, POST(), schema, GET(), POST(), GET(), POST(), schema (+37 more)

### Community 15 - "loyalty-context.ts"
Cohesion: 0.11
Nodes (41): ref_react_dom_server, buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), updateWalletBalance(), incrementBalanceData(), ActiveMerchantLoyaltyContext (+33 more)

### Community 16 - "prisma.ts"
Cohesion: 0.09
Nodes (36): POST(), POST(), GET(), POST(), schema, GET(), DELETE(), GET() (+28 more)

### Community 17 - "card-enlarged-view.tsx"
Cohesion: 0.13
Nodes (20): ref_motion_react, react-dom, ref_react_dom_client, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCode() (+12 more)

### Community 18 - "cn"
Cohesion: 0.08
Nodes (36): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), CRITICAL_PERMISSIONS, DEMO, Employee (+28 more)

### Community 19 - "getEmployeeSession"
Cohesion: 0.13
Nodes (12): EmployeeLoginPage(), EmployeeLoginScreen(), onSubmit(), readApiJson(), HomePage(), ProEntryPage(), SPACES, employeeFromToken() (+4 more)

### Community 20 - "platform-stats.ts"
Cohesion: 0.30
Nodes (11): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), PeriodKey (+3 more)

### Community 21 - "demo-visual.ts"
Cohesion: 0.10
Nodes (23): CarteIdentitePage(), DEMO_TIER_POINTS, GlobalCardMode, loyaltyCardDisplayName(), PREVIEW_CARDS, PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE (+15 more)

### Community 22 - "fife-life/merchant-detail.tsx"
Cohesion: 0.13
Nodes (27): CustomerProgramView, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel(), notifyMerchantRewardProgressRefresh(), TargetBlock(), activityFromWalletEvent() (+19 more)

### Community 23 - "money.ts"
Cohesion: 0.17
Nodes (17): RewardConfig, evaluateReward(), parseRewardConditions(), RewardConditions, rewardIsStackable(), RewardStatus, RewardUsage, unitForReward() (+9 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.10
Nodes (30): GET(), GET(), AppLoginPage(), CustomerLoginPage(), JoinMerchantPage(), getPublishedCardTemplate(), isGoogleAuthConfigured(), consumeGoogleCallback() (+22 more)

### Community 25 - "ref_next_server"
Cohesion: 0.11
Nodes (19): ref_next_server, hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), MerchantAppAccess (+11 more)

### Community 26 - "writeAudit"
Cohesion: 0.22
Nodes (21): POST(), POST(), DELETE(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET() (+13 more)

### Community 27 - "profile-page.tsx"
Cohesion: 0.07
Nodes (43): AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_PROFILE_HISTORY, AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage() (+35 more)

### Community 28 - "loyalty-commit.ts"
Cohesion: 0.08
Nodes (50): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+42 more)

### Community 29 - "merchant-card-renderer.tsx"
Cohesion: 0.12
Nodes (32): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRendererProps, resolveDisplayQrSrc(), shouldHideElement() (+24 more)

### Community 30 - "card-template-schema.ts"
Cohesion: 0.08
Nodes (32): CardTemplateBackground(), LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), buildCardBackgroundImageStyle() (+24 more)

### Community 31 - "ProgramConfigurator"
Cohesion: 0.21
Nodes (18): modeTitle(), ProgramConfigurator(), addReward(), isCurrentReward(), markDirty(), moveReward(), publish(), renderAdvantagesEditor() (+10 more)

### Community 32 - "jsonOk"
Cohesion: 0.15
Nodes (24): GET(), GET(), PATCH(), GET(), POST(), GET(), GET(), PERIODS (+16 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.10
Nodes (31): CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction(), saveDraft() (+23 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.11
Nodes (26): ApiResponse, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder, OverviewTab() (+18 more)

### Community 37 - "super-admin.test.ts"
Cohesion: 0.20
Nodes (12): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+4 more)

### Community 38 - "employee-session.ts"
Cohesion: 0.14
Nodes (24): ref_next_headers, GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), applyDemoRoleCookies() (+16 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "LoyaltyError"
Cohesion: 0.50
Nodes (6): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), computeLoyalty(), LoyaltyError, LoyaltySnapshot

### Community 41 - "media-storage.ts"
Cohesion: 0.12
Nodes (26): GET(), MIME, appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind (+18 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "env.ts"
Cohesion: 0.13
Nodes (8): assertEarnProgramRules(), assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), env, getAllowedOrigins()

### Community 44 - "vitest"
Cohesion: 0.15
Nodes (12): ref_fs, ref_path, vitest, ref_vitest_config, main(), outDir, shot(), outDir (+4 more)

### Community 45 - "demo-mode.ts"
Cohesion: 0.13
Nodes (19): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled() (+11 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.11
Nodes (25): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+17 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "customer-loyalty-overview.ts"
Cohesion: 0.10
Nodes (28): AddToGoogleWalletButton(), WalletEventPayload, usePersonalizedQr(), WalletHome(), WalletQrAction(), ActiveWalletCard, ActivityItem, buildCardNextRewardEntry() (+20 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (22): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+14 more)

### Community 50 - "qr-cache.ts"
Cohesion: 0.17
Nodes (17): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr() (+9 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (28): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), configuredSubjectId(), createQaMagicLoginToken(), CreateQaMagicLoginTokenOptions (+20 more)

### Community 52 - "caisse-scan.ts"
Cohesion: 0.20
Nodes (14): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber(), deriveClientNumber(), normalizeClientNumber() (+6 more)

### Community 53 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+9 more)

### Community 54 - "syncGoogleWalletMembershipObject"
Cohesion: 0.16
Nodes (24): accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue(), ensureGlobalClassRecord() (+16 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (12): nodemailer, buildInvitationContent(), emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry(), isEmailConfigured() (+4 more)

### Community 56 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+7 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.11
Nodes (29): percentChange(), resolvePeriod(), buildFinancial(), buildOverview(), buildRewards(), buildSegments(), buildTeam(), getFreeMerchantStats() (+21 more)

### Community 58 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 59 - "card-deck.tsx"
Cohesion: 0.18
Nodes (14): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+6 more)

### Community 60 - "types.ts"
Cohesion: 0.17
Nodes (9): LinearGauge(), MerchantCardPublicPreview(), MerchantCardRenderer(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList() (+1 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+5 more)

### Community 63 - "[kind]/route.ts"
Cohesion: 0.19
Nodes (8): ref_fs_promises, ref_os, OUT, tiers, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 64 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.14
Nodes (25): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+17 more)

### Community 66 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 67 - "src/app/layout.tsx"
Cohesion: 0.14
Nodes (9): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 68 - "EmployeeDetailPanel"
Cohesion: 0.27
Nodes (7): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend(), togglePermission()

### Community 69 - "qr.ts"
Cohesion: 0.24
Nodes (11): main(), prisma, requiredEnv(), upsertEmployee(), jose, assertQrUsable(), QrError, QrPayload (+3 more)

### Community 70 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 71 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 72 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 73 - "isGoogleWalletConfigured"
Cohesion: 0.17
Nodes (14): POST(), POST(), dynamic, logCustomerQr(), POST(), runtime, schema, POST() (+6 more)

### Community 74 - "landing-header.tsx"
Cohesion: 0.29
Nodes (6): next-themes, MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 75 - "loyaltyBalanceForMode"
Cohesion: 0.10
Nodes (30): main(), dynamic, GET(), GET(), GET(), CarteIndexPage(), dynamic, CardPage() (+22 more)

### Community 76 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 77 - "insight-period.ts"
Cohesion: 0.18
Nodes (25): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+17 more)

### Community 78 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

### Community 79 - "trim-card-images.mjs"
Cohesion: 0.40
Nodes (3): ref_sharp, files, INPUT_DIR

### Community 80 - "caisse-scan-route.test.ts"
Cohesion: 0.29
Nodes (5): processCaisseScan, processCaisseScanByClientNumber, requireCaisse, requireMutatingRequest, writeAudit

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

### Community 86 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "app/ui.tsx"
Cohesion: 0.25
Nodes (5): HomeStats, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "program/route.ts"
Cohesion: 0.31
Nodes (9): GET(), sortOrder(), GET(), loadProgram(), POST(), syncGoogleWalletMerchant(), balanceFieldForUnit(), loyaltyDraftSchema (+1 more)

### Community 102 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 103 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 104 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 105 - "insight-permissions.test.ts"
Cohesion: 0.40
Nodes (4): admin, cashier, grantedCashier, manager

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 108 - "employee-invitation-service.ts"
Cohesion: 0.22
Nodes (14): buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), createMembershipInvitation() (+6 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

## Knowledge Gaps
- **623 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+618 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 842 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `@prisma/client` to `jsonError`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `super-admin-session.ts`, `google-wallet.ts`, `ref_next_navigation`, `use-wallet-unlock-animation.ts`, `loyalty-widget.ts`, `validation.ts`, `loyalty-context.ts`, `prisma.ts`, `cn`, `platform-stats.ts`, `fife-life/merchant-detail.tsx`, `money.ts`, `google-auth.ts`, `ref_next_server`, `profile-page.tsx`, `loyalty-commit.ts`, `merchant-card-renderer.tsx`, `card-template-schema.ts`, `jsonOk`, `card-editor.tsx`, `package.json`, `super-admin.test.ts`, `employee-session.ts`, `customer-loyalty-overview.ts`, `loyalty-program-publication.ts`, `qa-login.ts`, `insight-stats.ts`, `types.ts`, `loyalty-service.test.ts`, `qr.ts`, `customer-qr.ts`, `loyaltyBalanceForMode`, `create-super-admin.ts`, `program/route.ts`, `employee-invitation-service.ts`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `scan/ui.tsx`, `merchant-card-template-service.ts`, `super-admin-session.ts`, `use-wallet-unlock-animation.ts`, `loyalty-widget-view.tsx`, `interactive-loyalty-card.tsx`, `@prisma/client`, `card-enlarged-view.tsx`, `cn`, `demo-visual.ts`, `fife-life/merchant-detail.tsx`, `profile-page.tsx`, `merchant-card-renderer.tsx`, `card-template-schema.ts`, `card-editor.tsx`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `customer-loyalty-overview.ts`, `qr-cache.ts`, `card-deck.tsx`, `types.ts`, `src/app/layout.tsx`, `[id]/merchant-detail.tsx`, `landing-header.tsx`, `qa-login/page.tsx`, `app/ui.tsx`, `use-media-query.ts`, `landing-faq.tsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `ref_node_path`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `react`, `ref_next_navigation`, `use-wallet-unlock-animation.ts`, `loyalty-widget.ts`, `@prisma/client`, `validation.ts`, `loyalty-context.ts`, `prisma.ts`, `card-enlarged-view.tsx`, `getEmployeeSession`, `platform-stats.ts`, `demo-visual.ts`, `fife-life/merchant-detail.tsx`, `money.ts`, `google-auth.ts`, `ref_next_server`, `loyalty-commit.ts`, `merchant-card-renderer.tsx`, `card-template-schema.ts`, `package.json`, `google-wallet-media-crop.tsx`, `super-admin.test.ts`, `LoyaltyError`, `media-storage.ts`, `loyalty-commit.test.ts`, `env.ts`, `customer-loyalty-overview.ts`, `loyalty-program-publication.ts`, `qa-login.ts`, `caisse-scan.ts`, `email.ts`, `insight-stats.ts`, `caisse-scan.test.ts`, `card-deck.tsx`, `loyalty-service.test.ts`, `[kind]/route.ts`, `google-wallet/route.ts`, `src/app/layout.tsx`, `qr.ts`, `loyaltyBalanceForMode`, `insight-period.ts`, `caisse-scan-route.test.ts`, `api-merchant-statistics-route.test.ts`, `customer-qr-route.test.ts`, `insight-permissions.test.ts`, `employee-invitation-service.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _623 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `jsonError` be split into smaller, more focused modules?**
  _Cohesion score 0.08725542041248018 - nodes in this community are weakly interconnected._
- **Should `ref_node_path` be split into smaller, more focused modules?**
  _Cohesion score 0.037023324694557574 - nodes in this community are weakly interconnected._
- **Should `scan/ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05322128851540616 - nodes in this community are weakly interconnected._