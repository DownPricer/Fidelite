# Graph Report - Cartefidelité  (2026-09-23)

## Corpus Check
- 586 files · ~4,722,760 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 3090 nodes · 9617 edges · 155 communities (135 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1633fc48`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- wallet-home.tsx
- card-template-schema.ts
- scan-session.ts
- merchant-card-template-service.ts
- next
- react
- rbac.ts
- ref_next_navigation
- jsonError
- loyalty-widget-view.tsx
- loyalty-widget.ts
- readJson
- jsonOk
- card-editor-canvas.tsx
- requireMutatingRequest
- loyalty-labels.ts
- super-admin/auth/login/route.ts
- new-card-toast.tsx
- cn
- use-wallet-unlock-animation.ts
- insight-period.ts
- requireUser
- cashier-checkout.tsx
- card-editor-properties.tsx
- google-auth.ts
- env.ts
- loyalty-commit.ts
- profile-page.tsx
- loyalty-program.ts
- merchant-roulette.tsx
- caisse-scan.test.ts
- merchant-app-access.ts
- campaigns/[id]/confirm/route.ts
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- buildGoogleWalletMerchantView
- demo-session.ts
- What You Must Do When Invoked
- @prisma/client
- media-storage.ts
- loyalty-commit.test.ts
- card-enlarged-view.tsx
- ref_fs_promises
- demo-routing.test.ts
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
- qr.ts
- scan/ui.tsx
- ref_next_link
- loyalty-service.test.ts
- scripts
- api-merchant-statistics-route.test.ts
- platform-stats.ts
- google-wallet/route.ts
- programme/ui.tsx
- loyalty-context.ts
- campaign-quota.test.ts
- webhook/route.ts
- card-deck.tsx
- merchants-list.tsx
- merchant-card-renderer.tsx
- CardEditorBackgroundCrop
- session.ts
- customer-loyalty-overview.ts
- unsubscribe-token.ts
- EmployeeDetailPanel
- MerchantDetailPage
- cards-index.tsx
- use-media-query.ts
- cartes.js
- Fidelo
- docker-entrypoint.sh
- create-super-admin.ts
- campaign-quota.ts
- customer-preferences-route.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- getSuperAdminSessionUser
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- vitest
- scan/route.ts
- [kind]/route.ts
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
- customer-qr.ts
- EmployeeLoginScreen
- campaign-confirm-route.test.ts
- stripe-webhook-route.test.ts
- landing-page.test.ts
- campaign-lifecycle.ts
- super-admin.test.ts
- resolvePublishedMerchantCardTemplate
- lib/campaign-worker.ts
- discover-page.tsx
- loyalty-reward-removal.ts
- scripts/campaign-worker.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- campaign-moderation-home.tsx
- campaign-crud-routes.test.ts
- customer-notifications-route.test.ts
- customer-profile.ts
- push-client.ts
- google-wallet-doctor.ts
- customer-push-route.test.ts
- csrf.ts
- landing-merchant-preview.tsx
- employees/[id]/route.ts
- outils/ui.tsx
- campaign-audience.test.ts
- MerchantHome
- SettingsPanel
- caisse-client-number.test.ts
- employee-invitation-service.ts
- preferences/route.ts
- super-admin-session.ts
- qr-input.ts
- EmployeeScanScreen

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 188 edges
2. `jsonOk()` - 170 edges
3. `requireMutatingRequest()` - 115 edges
4. `prisma` - 108 edges
5. `react` - 94 edges
6. `vitest` - 91 edges
7. `@prisma/client` - 89 edges
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
- `legacyTemplateWithoutQr()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/wallet-hydration.test.tsx → src/lib/card-template-schema.ts
- `templateWithExistingQr()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/wallet-hydration.test.tsx → src/lib/card-template-schema.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (155 total, 20 thin omitted)

### Community 0 - "wallet-home.tsx"
Cohesion: 0.11
Nodes (20): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), CustomerProgramView, MerchantCardDetail(), fallbackCopyLink(), shareCard(), notifyMerchantRewardProgressRefresh() (+12 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.11
Nodes (20): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CARD_SCHEMA_VERSION, QR_MIN_SIZE, CardDecorativeStyle, cardElementSchema (+12 more)

### Community 2 - "scan-session.ts"
Cohesion: 0.21
Nodes (20): CaisseScreen(), formatCameraError(), QrScanner(), onDecode(), CAISSE_SCAN_PATH, CAMERA_START_TIMEOUT_MS, finalizeCameraStart(), formatRetryAfter() (+12 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (51): LegacyCardEditorRedirect(), CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), cardSlotForLoyaltyMode(), isLoyaltyProgramSlot() (+43 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.09
Nodes (26): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), EmployeeInvitationScreen(), ChangePasswordPage(), LOYALTY_MODES (+18 more)

### Community 6 - "rbac.ts"
Cohesion: 0.15
Nodes (13): heatmap, INSIGHT_DEMO_RESPONSE, assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canManageEmployees(), canViewAllCustomers(), MAX_ACTIVE_EMPLOYEES (+5 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.15
Nodes (29): ref_next_navigation, CampagnesPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), OutilsPage() (+21 more)

### Community 8 - "jsonError"
Cohesion: 0.12
Nodes (29): GET(), PATCH(), GET(), POST(), GET(), GET(), GET(), POST() (+21 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (34): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+26 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (49): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, missingWidgetLabel(), publishValidationResult(), summarizeEditorValidation() (+41 more)

### Community 11 - "readJson"
Cohesion: 0.12
Nodes (32): POST(), POST(), POST(), POST(), PATCH(), DELETE(), POST(), POST() (+24 more)

### Community 12 - "jsonOk"
Cohesion: 0.10
Nodes (38): GET(), GET(), GET(), GET(), PATCH(), GET(), POST(), GET() (+30 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.12
Nodes (38): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+30 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.17
Nodes (30): POST(), POST(), schema, POST(), POST(), POST(), POST(), POST() (+22 more)

### Community 15 - "loyalty-labels.ts"
Cohesion: 0.16
Nodes (21): MerchantRewardProgressPanel(), assertEarnProgramRules(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), incrementBalanceData(), setActiveBalanceData(), computeLoyalty() (+13 more)

### Community 16 - "super-admin/auth/login/route.ts"
Cohesion: 0.13
Nodes (25): POST(), schema, POST(), POST(), schema, dynamic, logCustomerQr(), POST() (+17 more)

### Community 17 - "new-card-toast.tsx"
Cohesion: 0.12
Nodes (20): ref_motion_react, react-dom, ref_react_dom_client, CardsSheet(), ExpandableQrCode(), handleActivate(), openQr(), ExpandableQrCodeProps (+12 more)

### Community 18 - "cn"
Cohesion: 0.09
Nodes (29): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel() (+21 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.12
Nodes (26): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), isDocumentVisible() (+18 more)

### Community 20 - "insight-period.ts"
Cohesion: 0.23
Nodes (20): addParisDays(), addParisMonths(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey (+12 more)

### Community 21 - "requireUser"
Cohesion: 0.09
Nodes (28): POST(), DELETE(), POST(), GET(), dynamic, GET(), dynamic, GET() (+20 more)

### Community 22 - "cashier-checkout.tsx"
Cohesion: 0.13
Nodes (25): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+17 more)

### Community 23 - "card-editor-properties.tsx"
Cohesion: 0.12
Nodes (24): CardEditorProperties(), patchRect(), REQUIRED_BY_SLOT, TEXT_TYPES, qrOverlapsOthers(), BACKGROUND_FIT_LABELS, containsForbiddenTechnicalLabel(), DATA_KEY_LABELS (+16 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.11
Nodes (29): GET(), GET(), AppLoginPage(), CustomerLoginPage(), JoinMerchantPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl() (+21 more)

### Community 25 - "env.ts"
Cohesion: 0.09
Nodes (22): ref_next_server, GET(), env, hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost() (+14 more)

### Community 26 - "loyalty-commit.ts"
Cohesion: 0.18
Nodes (19): appliedTierLabel(), assembleView(), buildView(), CAISSE_GRANT_TTL_MS, commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive() (+11 more)

### Community 27 - "profile-page.tsx"
Cohesion: 0.08
Nodes (36): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+28 more)

### Community 28 - "loyalty-program.ts"
Cohesion: 0.09
Nodes (38): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes(), LoyaltyAction (+30 more)

### Community 29 - "merchant-roulette.tsx"
Cohesion: 0.38
Nodes (3): LinearGauge(), MerchantFace(), MerchantRoulette()

### Community 30 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 31 - "merchant-app-access.ts"
Cohesion: 0.18
Nodes (15): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace(), canOpenCaisse() (+7 more)

### Community 32 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.38
Nodes (12): POST(), GET(), GET(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience(), planAndRemainingQuota() (+4 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.10
Nodes (34): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+26 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (31): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+23 more)

### Community 37 - "buildGoogleWalletMerchantView"
Cohesion: 0.28
Nodes (16): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData() (+8 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.19
Nodes (15): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), applyDemoRoleCookies() (+7 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "@prisma/client"
Cohesion: 0.12
Nodes (26): @prisma/client, TargetBlock(), buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT (+18 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.12
Nodes (27): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, deleteCardBackgroundIfUnused() (+19 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "card-enlarged-view.tsx"
Cohesion: 0.09
Nodes (31): CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard() (+23 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.15
Nodes (11): ref_fs_promises, ref_sharp, OUT, tiers, files, INPUT_DIR, GET(), MIME (+3 more)

### Community 45 - "demo-routing.test.ts"
Cohesion: 0.12
Nodes (20): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie() (+12 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (30): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+22 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (19): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+11 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "qr-cache.ts"
Cohesion: 0.14
Nodes (18): ref_react_dom_server, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr() (+10 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.07
Nodes (41): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), POST(), QaExchangeBody, qaJson() (+33 more)

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

### Community 58 - "qr.ts"
Cohesion: 0.25
Nodes (11): main(), prisma, requiredEnv(), upsertEmployee(), processCaisseScan(), assertQrUsable(), QrError, QrPayload (+3 more)

### Community 59 - "scan/ui.tsx"
Cohesion: 0.11
Nodes (19): ADMIN_PERMISSIONS, ScanResult, EmployeeProfile, Phase, ScanResult, CashierScanResult, ClientNumberField(), CaisseScanRequest (+11 more)

### Community 60 - "ref_next_link"
Cohesion: 0.09
Nodes (15): ref_next_link, HomeStats, QUICK_ACTIONS, StatsPreview, TrendMetric, SPACES, COLUMNS, isInternalPath() (+7 more)

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
Cohesion: 0.30
Nodes (11): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), PeriodKey (+3 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.12
Nodes (32): zod, GET(), POST(), POST(), POST(), schema, ensureWalletClassRecord(), parseWalletAction() (+24 more)

### Community 66 - "programme/ui.tsx"
Cohesion: 0.09
Nodes (37): DEMO_CONFIG, HistoricalEntitlement, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), deleteReward(), handleRewardSave() (+29 more)

### Community 67 - "loyalty-context.ts"
Cohesion: 0.12
Nodes (32): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot (+24 more)

### Community 68 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 69 - "webhook/route.ts"
Cohesion: 0.21
Nodes (15): stripe, handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), POST(), refundIncludedQuota() (+7 more)

### Community 70 - "card-deck.tsx"
Cohesion: 0.18
Nodes (13): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+5 more)

### Community 71 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.10
Nodes (37): MerchantCardPublicPreview(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps (+29 more)

### Community 74 - "session.ts"
Cohesion: 0.16
Nodes (14): GET(), EmployeeLoginPage(), dynamic, NotificationsPage(), ProEntryPage(), SPACES, getEmployeeSession(), LandingAuthTargets (+6 more)

### Community 75 - "customer-loyalty-overview.ts"
Cohesion: 0.10
Nodes (32): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, buildScanResult() (+24 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

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

### Community 85 - "campaign-quota.ts"
Cohesion: 0.23
Nodes (11): consumeQuotaForCampaign(), priceMemberOrNetworkCampaign(), PricingResult, quotaKindFor(), CAMPAIGN_PRICE_CENTS, INCLUDED_QUOTAS, isNetworkQuotaKind(), PlanTier (+3 more)

### Community 86 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "getSuperAdminSessionUser"
Cohesion: 0.07
Nodes (28): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCardsPage() (+20 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.08
Nodes (26): AD_STATUS_LABELS, addDaysToDateInput(), AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampagnesPanel(), CampaignSummary (+18 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "vitest"
Cohesion: 0.08
Nodes (21): ref_fs, ref_path, vitest, ref_vitest_config, main(), outDir, shot(), outDir (+13 more)

### Community 102 - "scan/route.ts"
Cohesion: 0.19
Nodes (13): logScanBody(), POST(), scanVia(), CaisseScanError, maskClientNumberForLog(), processCaisseScanByClientNumber(), publicQrErrorMessage(), processCaisseScan (+5 more)

### Community 103 - "[kind]/route.ts"
Cohesion: 0.28
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.14
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
Cohesion: 0.10
Nodes (22): GET(), FILTER_MAP, GET(), dynamic, GET(), GET(), PERIOD_KEYS, requireEmployee() (+14 more)

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
Cohesion: 0.29
Nodes (5): DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationsCenter()

### Community 118 - "employee-session.ts"
Cohesion: 0.23
Nodes (12): cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, readEmployeeCookie() (+4 more)

### Community 120 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 121 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 122 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.13
Nodes (15): baseCampaign, campaignFindFirst, campaignPaymentCreate, campaignUpdate, createCampaignCheckoutSession, estimateMerchantMembersAudience, estimateNetworkLocalAudience, FakeStripeNotConfiguredError (+7 more)

### Community 124 - "stripe-webhook-route.test.ts"
Cohesion: 0.15
Nodes (10): campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, FakeStripeNotConfiguredError, refundIncludedQuota (+2 more)

### Community 125 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 126 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 127 - "super-admin.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 128 - "resolvePublishedMerchantCardTemplate"
Cohesion: 0.21
Nodes (12): GET(), LOYALTY_MODES, GET(), dynamic, MerchantProfilePage(), getPublishedCardTemplate(), logMerchantCardSwitch(), MerchantCardSwitchContext (+4 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.26
Nodes (12): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+4 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.27
Nodes (5): DiscoverPage(), Merchant, Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

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
Cohesion: 0.22
Nodes (6): AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget, SuperAdminCampagnesPage()

### Community 136 - "campaign-crud-routes.test.ts"
Cohesion: 0.22
Nodes (7): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 137 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 138 - "customer-profile.ts"
Cohesion: 0.22
Nodes (16): GET(), CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_HISTORY, PREVIEW_PROFILE_HISTORY, ensureCustomerPreferences() (+8 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "google-wallet-doctor.ts"
Cohesion: 0.39
Nodes (8): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl()

### Community 141 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 142 - "csrf.ts"
Cohesion: 0.60
Nodes (3): assertSameOrigin(), CsrfError, getAllowedOrigins()

### Community 143 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 144 - "employees/[id]/route.ts"
Cohesion: 0.29
Nodes (13): GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST(), canExposeInvitationLinkInAdmin() (+5 more)

### Community 145 - "outils/ui.tsx"
Cohesion: 0.29
Nodes (5): FidelisationPanel(), icons, OutilsPanel(), TOOLS, ToolCard()

### Community 149 - "caisse-client-number.test.ts"
Cohesion: 0.23
Nodes (11): findUserByCustomerNumber(), deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber(), scanSchema, fifeLifeQrTokenCreate (+3 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.13
Nodes (23): GET(), POST(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken() (+15 more)

### Community 151 - "preferences/route.ts"
Cohesion: 0.24
Nodes (10): GET(), PATCH(), bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, extractConsentChanges() (+2 more)

### Community 152 - "super-admin-session.ts"
Cohesion: 0.44
Nodes (7): isProduction(), cookieOptions(), createSuperAdminSession(), destroySuperAdminSession(), getSuperAdminUserFromToken(), hashSuperAdminToken(), isSuperAdminEmailAllowed()

### Community 153 - "qr-input.ts"
Cohesion: 0.43
Nodes (5): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken()

### Community 154 - "EmployeeScanScreen"
Cohesion: 0.29
Nodes (3): EmployeeScanScreen(), statusLabel(), DEMO_EMPLOYEE

## Knowledge Gaps
- **754 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+749 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1003 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `lib/campaign-worker.ts`, `scan-session.ts`, `merchant-card-template-service.ts`, `loyalty-reward-removal.ts`, `react`, `rbac.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-crud-routes.test.ts`, `customer-notifications-route.test.ts`, `loyalty-widget.ts`, `push-client.ts`, `loyalty-widget-view.tsx`, `card-editor-canvas.tsx`, `customer-push-route.test.ts`, `loyalty-labels.ts`, `super-admin/auth/login/route.ts`, `new-card-toast.tsx`, `campaign-audience.test.ts`, `use-wallet-unlock-animation.ts`, `insight-period.ts`, `caisse-client-number.test.ts`, `employee-invitation-service.ts`, `cashier-checkout.tsx`, `google-auth.ts`, `env.ts`, `qr-input.ts`, `loyalty-program.ts`, `caisse-scan.test.ts`, `merchant-app-access.ts`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `@prisma/client`, `media-storage.ts`, `loyalty-commit.test.ts`, `demo-routing.test.ts`, `loyalty-program-publication.ts`, `qr-cache.ts`, `qa-login.ts`, `ref_node_path`, `email.ts`, `insight-stats.ts`, `qr.ts`, `loyalty-service.test.ts`, `api-merchant-statistics-route.test.ts`, `platform-stats.ts`, `loyalty-context.ts`, `campaign-quota.test.ts`, `card-deck.tsx`, `merchant-card-renderer.tsx`, `session.ts`, `customer-loyalty-overview.ts`, `unsubscribe-token.ts`, `campaign-quota.ts`, `customer-preferences-route.test.ts`, `scan/route.ts`, `[kind]/route.ts`, `src/app/layout.tsx`, `campaign-worker.test.ts`, `api-guard.ts`, `campaign-confirm-route.test.ts`, `stripe-webhook-route.test.ts`, `landing-page.test.ts`, `campaign-lifecycle.ts`, `super-admin.test.ts`?**
  _High betweenness centrality (0.158) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `resolvePublishedMerchantCardTemplate`, `wallet-home.tsx`, `lib/campaign-worker.ts`, `loyalty-reward-removal.ts`, `merchant-card-template-service.ts`, `rbac.ts`, `jsonError`, `loyalty-widget.ts`, `customer-profile.ts`, `jsonOk`, `card-editor-canvas.tsx`, `requireMutatingRequest`, `loyalty-labels.ts`, `super-admin/auth/login/route.ts`, `use-wallet-unlock-animation.ts`, `cashier-checkout.tsx`, `card-editor-properties.tsx`, `preferences/route.ts`, `employee-invitation-service.ts`, `google-auth.ts`, `profile-page.tsx`, `loyalty-commit.ts`, `loyalty-program.ts`, `super-admin-session.ts`, `merchant-app-access.ts`, `campaigns/[id]/confirm/route.ts`, `card-editor.tsx`, `package.json`, `loyalty-program-publication.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `qr.ts`, `scan/ui.tsx`, `ref_next_link`, `loyalty-service.test.ts`, `platform-stats.ts`, `programme/ui.tsx`, `loyalty-context.ts`, `merchant-card-renderer.tsx`, `session.ts`, `customer-loyalty-overview.ts`, `cards-index.tsx`, `create-super-admin.ts`, `campaign-quota.ts`, `api-guard.ts`, `employee-session.ts`, `env.ts`, `customer-qr.ts`, `campaign-lifecycle.ts`, `super-admin.test.ts`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `wallet-home.tsx`, `card-template-schema.ts`, `discover-page.tsx`, `merchant-card-template-service.ts`, `scan-session.ts`, `campaign-moderation-home.tsx`, `loyalty-widget-view.tsx`, `card-editor-canvas.tsx`, `new-card-toast.tsx`, `cn`, `use-wallet-unlock-animation.ts`, `cashier-checkout.tsx`, `card-editor-properties.tsx`, `profile-page.tsx`, `merchant-roulette.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `@prisma/client`, `card-enlarged-view.tsx`, `src/app/page.tsx`, `wallet-event-dedup.ts`, `qr-cache.ts`, `qa-login.ts`, `scan/ui.tsx`, `ref_next_link`, `programme/ui.tsx`, `loyalty-context.ts`, `card-deck.tsx`, `merchants-list.tsx`, `merchant-card-renderer.tsx`, `cards-index.tsx`, `use-media-query.ts`, `getSuperAdminSessionUser`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `landing-header.tsx`, `notifications-center.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _754 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `wallet-home.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11088709677419355 - nodes in this community are weakly interconnected._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10869565217391304 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07380520266182698 - nodes in this community are weakly interconnected._