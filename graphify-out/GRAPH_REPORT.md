# Graph Report - Cartefidelité  (2026-10-01)

## Corpus Check
- 654 files · ~4,771,060 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 6, .example 4, .css 3)

## Summary
- 3594 nodes · 11044 edges · 163 communities (145 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 71 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `81a3cb9f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- next-reward-styles.ts
- rbac.ts
- merchant-card-template-service.ts
- src/app/layout.tsx
- react
- loyalty-program.ts
- ref_next_navigation
- employee-session.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-canvas.tsx
- requireMutatingRequest
- loyalty-service.ts
- @prisma/client
- jsonOk
- merchant-ui.tsx
- use-wallet-unlock-animation.ts
- clients/ui.tsx
- profile-page.tsx
- insight-period.ts
- jsonError
- google-auth.ts
- env.ts
- loyaltyBalanceForMode
- audit.ts
- ad-detail.tsx
- reward-form-dialog.tsx
- layout-shell.tsx
- create-super-admin.ts
- ads/[id]/confirm/route.ts
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- demo-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- loyalty-card-view-model.ts
- ref_fs_promises
- demo-routing.test.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- loyalty-program-publication.ts
- customer-loyalty-overview.ts
- qa-login.ts
- ref_node_path
- dependencies
- isGoogleWalletConfigured
- email.ts
- devDependencies
- insight-stats.ts
- HourlySchedulePicker
- demo-visual.ts
- wallet-hydration.test.tsx
- loyalty-service.test.ts
- scripts
- types.ts
- platform-stats.ts
- google-wallet/route.ts
- wallet-home.tsx
- vitest
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- MerchantCardData
- card-editor-properties.tsx
- merchant-card-renderer.tsx
- AdvantagesEditor
- merchant/ads/route.ts
- ref_next_server
- unsubscribe/route.ts
- session.ts
- MerchantDetailPage
- stripe.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- EmployeeDetailPanel
- campaign-moderation-home.tsx
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- marketing-balance.test.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- customer-reward-progress.ts
- statistics/route.ts
- lib/campaign-worker.ts
- loyalty-commit.ts
- programme/ui.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- prisma.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- cn
- ad-confirm-route.test.ts
- card-deck.tsx
- campaign-confirm-route.test.ts
- fake-ad-db.ts
- events/route.ts
- loyalty-reward-removal.ts
- merchant-card-finish.test.ts
- webhook/route.ts
- merchants-list.tsx
- discover-page.tsx
- push.ts
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- qa-login/page.tsx
- merchant-ad-edit.test.ts
- landing-page.test.ts
- campaign-test-mode-isolation.test.ts
- google-wallet-doctor.ts
- push-client.ts
- employee-access.test.ts
- CreateMerchantWizard
- campaign-audience.ts
- avatar/route.ts
- scripts/campaign-worker.ts
- EmployeeLoginScreen
- CampagnesPanel
- use-media-query.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- SettingsPanel
- marketing-balance/route.ts
- customer-preferences-route.test.ts
- google-wallet.ts
- app/ui.tsx
- solde/ui.tsx
- merchant-app-access.ts
- sponsored-hours-pricing.ts
- super-admin-ad-moderation.test.ts
- ad-visual-journeys.test.ts
- invitation/page.tsx
- landing-footer.tsx
- card-template-schema.ts

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 225 edges
2. `jsonOk()` - 201 edges
3. `requireMutatingRequest()` - 138 edges
4. `prisma` - 129 edges
5. `vitest` - 109 edges
6. `readJson()` - 102 edges
7. `react` - 101 edges
8. `clientIp()` - 100 edges
9. `userAgent()` - 96 edges
10. `@prisma/client` - 94 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runAdLifecycleTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/ad-lifecycle-worker.ts
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `submit()` --indirect_call--> `schedule()`  [INFERRED]
  src/app/app/campagnes/ui.tsx → tests/ad-visual-journeys.test.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (163 total, 18 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.11
Nodes (28): logScanBody(), POST(), scanVia(), buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan() (+20 more)

### Community 1 - "next-reward-styles.ts"
Cohesion: 0.19
Nodes (15): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CARD_FONT_OPTIONS, CardFontId (+7 more)

### Community 2 - "rbac.ts"
Cohesion: 0.19
Nodes (12): CustomerDetailPage(), assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canViewAllCustomers(), MAX_ACTIVE_EMPLOYEES, staffHasPermission(), StaffMembership (+4 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (54): LegacyCardEditorRedirect(), CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), cardSlotForLoyaltyMode(), isLoyaltyProgramSlot() (+46 more)

### Community 4 - "src/app/layout.tsx"
Cohesion: 0.07
Nodes (14): nextConfig, next, ref_next_font_google, metadata, viewport, src_app_globals, dynamic, manrope (+6 more)

### Community 5 - "react"
Cohesion: 0.08
Nodes (28): ref_next_link, react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), SPACES, ChangePasswordPage() (+20 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.12
Nodes (29): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, evaluateEarn(), formatDurationMinutes(), minutesBetween(), progressLabelFor() (+21 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.23
Nodes (20): ref_next_navigation, CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage() (+12 more)

### Community 8 - "employee-session.ts"
Cohesion: 0.11
Nodes (26): EmployeeLoginPage(), HomePage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS (+18 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.14
Nodes (14): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct(), ProgressCircle() (+6 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (49): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), applyEditorAutoFix(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+41 more)

### Community 11 - "validation.ts"
Cohesion: 0.07
Nodes (34): GET(), POST(), GET(), POST(), deleteSchema, acceptInvitationWithPassword(), findInvitationByToken(), validateInvitationLookup() (+26 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.11
Nodes (42): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, elementLabel(), GuideLine (+34 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.14
Nodes (48): POST(), POST(), POST(), POST(), POST(), POST(), POST(), POST() (+40 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.17
Nodes (17): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), incrementBalanceData(), legacyPointsForUnitBalance(), LoyaltyBalanceFields, setActiveBalanceData(), computeLoyalty() (+9 more)

### Community 16 - "@prisma/client"
Cohesion: 0.11
Nodes (35): @prisma/client, formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot(), buildProgramSnapshotFromContext() (+27 more)

### Community 17 - "jsonOk"
Cohesion: 0.10
Nodes (36): GET(), GET(), GET(), GET(), GET(), PATCH(), GET(), POST() (+28 more)

### Community 18 - "merchant-ui.tsx"
Cohesion: 0.10
Nodes (23): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), FidelisationPanel(), icons (+15 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.24
Nodes (15): isDocumentVisible(), useWalletUnlockAnimation(), flushWhenVisible(), hasRenderReadyTemplate(), cardFromUnlockPayload(), fetchUnlockCardDetail(), isUnlockCardReadyForReveal(), parseTemplateFromPayload() (+7 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "profile-page.tsx"
Cohesion: 0.05
Nodes (53): next-themes, GET(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_PROFILE_HISTORY, AvatarFileInput(), AvatarPreviewEditor() (+45 more)

### Community 22 - "insight-period.ts"
Cohesion: 0.22
Nodes (23): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+15 more)

### Community 23 - "jsonError"
Cohesion: 0.08
Nodes (43): GET(), PATCH(), GET(), POST(), GET(), GET(), GET(), GET() (+35 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.10
Nodes (33): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+25 more)

### Community 25 - "env.ts"
Cohesion: 0.09
Nodes (27): assertSameOrigin(), CsrfError, env, getAllowedOrigins(), hostMatches(), hostnameOf(), isAdminHost(), isAppHost() (+19 more)

### Community 26 - "loyaltyBalanceForMode"
Cohesion: 0.12
Nodes (33): main(), dynamic, GET(), GET(), GET(), dynamic, MerchantProfilePage(), CarteIndexPage() (+25 more)

### Community 27 - "audit.ts"
Cohesion: 0.12
Nodes (25): POST(), schema, POST(), schema, POST(), POST(), POST(), createDirectEmployee() (+17 more)

### Community 28 - "ad-detail.tsx"
Cohesion: 0.09
Nodes (39): AdStatus, api(), Detail, euros(), HistoryRow, MerchantCampaignFiche(), addSources(), onFile() (+31 more)

### Community 29 - "reward-form-dialog.tsx"
Cohesion: 0.22
Nodes (11): emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit(), rewardTypeLabel(), RewardTypeOption (+3 more)

### Community 30 - "layout-shell.tsx"
Cohesion: 0.08
Nodes (23): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), MerchantCardsPage(), ACTIVITY_LABELS, DashboardHome() (+15 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "ads/[id]/confirm/route.ts"
Cohesion: 0.16
Nodes (24): computeAdPricing(), GET(), POST(), GET(), GET(), CAMPAIGN_PRICE_CENTS, consumeQuotaForCampaign(), planAndRemainingQuota() (+16 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (29): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+21 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (31): ApiResponse, COMPARISON_METRICS, FideliteTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder, MAX_COMPARISON_METRICS (+23 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.11
Nodes (29): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+21 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.15
Nodes (19): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+11 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.05
Nodes (67): GET(), ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeScanPage(), EmployeeProfile, EmployeeScanScreen(), Phase (+59 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.12
Nodes (28): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig (+20 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "loyalty-card-view-model.ts"
Cohesion: 0.18
Nodes (13): DEMO_TIER_DECK_ORDER, getLoyaltyCardTierLabel(), LOYALTY_CARD_BACKGROUNDS, LOYALTY_CARD_TIER_LABELS, LoyaltyCardTierKey, WALLET_TIER_TO_CARD_KEY, walletTierToCardKey(), buildLoyaltyCardViewModel() (+5 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.10
Nodes (17): ref_fs_promises, ref_os, ref_sharp, OUT, tiers, files, INPUT_DIR, GET() (+9 more)

### Community 45 - "demo-routing.test.ts"
Cohesion: 0.16
Nodes (14): ref_next_headers, CaisseAliasPage(), EmployeeHomePage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE (+6 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.07
Nodes (38): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+30 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (20): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+12 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "customer-loyalty-overview.ts"
Cohesion: 0.15
Nodes (19): activityFromWalletEvent(), buildCardNextRewardEntry(), buildFifeLifeNextReward(), buildHistoricalRewardOverview(), buildNextRewardCandidates(), CardNextRewardEntry, CardRewardProgress, CustomerLoyaltyOverview (+11 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.09
Nodes (36): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), POST(), QaExchangeBody, qaJson() (+28 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (39): ref_node_buffer, ref_node_fs, ref_node_fs_promises, ref_node_path, ref_node_url, ref_node_zlib, playwright, OUT (+31 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "isGoogleWalletConfigured"
Cohesion: 0.13
Nodes (30): isGoogleWalletConfigured(), accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue() (+22 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (14): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+6 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (33): InsightRange, percentChange(), buildComparison(), buildFinancial(), buildOverview(), buildRetention(), buildRewards(), buildSegments() (+25 more)

### Community 58 - "HourlySchedulePicker"
Cohesion: 0.17
Nodes (10): addDaysToDateInput(), formatHourRange(), HourlySchedulePicker(), addDay(), hourSelectOptions(), hoursToSlots(), scheduleDayError(), slotLabel() (+2 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.18
Nodes (12): CarteIdentitePage(), PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, DEMO_EMAIL, DEMO_FIRST_NAME, DEMO_FULL_NAME, DEMO_LAST_NAME (+4 more)

### Community 60 - "wallet-hydration.test.tsx"
Cohesion: 0.13
Nodes (19): ref_motion_react, react-dom, ref_react_dom_client, ExpandableQrCode(), handleActivate(), openQr(), ExpandableQrCodeProps, InteractiveCardShell() (+11 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "types.ts"
Cohesion: 0.08
Nodes (36): ref_react_dom_server, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName() (+28 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.10
Nodes (36): zod, POST(), POST(), dynamic, logCustomerQr(), POST(), runtime, schema (+28 more)

### Community 66 - "wallet-home.tsx"
Cohesion: 0.09
Nodes (23): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail() (+15 more)

### Community 67 - "vitest"
Cohesion: 0.08
Nodes (18): ref_fs, ref_path, vitest, ref_vitest_config, main(), outDir, shot(), outDir (+10 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "MerchantCardData"
Cohesion: 0.18
Nodes (8): CardsSheet(), LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList()

### Community 71 - "card-editor-properties.tsx"
Cohesion: 0.13
Nodes (21): CardEditorProperties(), patchRect(), REQUIRED_BY_SLOT, TEXT_TYPES, qrOverlapsOthers(), BACKGROUND_FIT_LABELS, containsForbiddenTechnicalLabel(), DATA_KEY_LABELS (+13 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.15
Nodes (28): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+20 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "merchant/ads/route.ts"
Cohesion: 0.34
Nodes (12): EDITABLE_STATUSES, PATCH(), POST(), POST(), schema, notifySuperAdmin(), setAdSources(), submitMerchantVersion() (+4 more)

### Community 75 - "ref_next_server"
Cohesion: 0.08
Nodes (15): ref_next_server, inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser, pushSubscriptionDeleteMany, pushSubscriptionUpsert (+7 more)

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.16
Nodes (15): jose, bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, recordConsentEvents(), secretKey() (+7 more)

### Community 77 - "session.ts"
Cohesion: 0.20
Nodes (13): POST(), GET(), GET(), DELETE(), GET(), parseUserAgent(), src_lib_google_wallet_isgooglewalletconfigured, cookieOptions() (+5 more)

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "stripe.ts"
Cohesion: 0.14
Nodes (22): stripe, CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, constructStripeWebhookEvent(), createCampaignCheckoutSession(), createMarketingTopupCheckoutSession() (+14 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.09
Nodes (25): AuditPage(), SuperAdminAuditPage(), SuperAdminAdDetailPage(), SuperAdminCampagnesPage(), SuperAdminCardsPage(), SuperAdminMerchantDetail(), CreateMerchantPage(), SuperAdminMerchantsPage() (+17 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "qr.ts"
Cohesion: 0.17
Nodes (17): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 85 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 86 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "marketing-balance.test.ts"
Cohesion: 0.27
Nodes (8): debitForCampaign(), Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (20): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+12 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "customer-reward-progress.ts"
Cohesion: 0.17
Nodes (16): MerchantRewardProgressPanel(), TargetBlock(), buildTargetView(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState (+8 more)

### Community 102 - "statistics/route.ts"
Cohesion: 0.15
Nodes (12): GET(), PERIOD_KEYS, InsightPeriodKey, getLockedInsightPlaceholder(), findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium (+4 more)

### Community 103 - "lib/campaign-worker.ts"
Cohesion: 0.25
Nodes (12): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+4 more)

### Community 104 - "loyalty-commit.ts"
Cohesion: 0.09
Nodes (41): FinancesTab(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), evaluateCustomerRewards(), isMerchantActive() (+33 more)

### Community 105 - "programme/ui.tsx"
Cohesion: 0.10
Nodes (20): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+12 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "prisma.ts"
Cohesion: 0.06
Nodes (50): GET(), DELETE(), FILTER_MAP, GET(), dynamic, GET(), dynamic, GET() (+42 more)

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

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "cn"
Cohesion: 0.10
Nodes (22): DashboardLayout(), ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate() (+14 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.13
Nodes (12): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+4 more)

### Community 122 - "card-deck.tsx"
Cohesion: 0.19
Nodes (13): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+5 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "fake-ad-db.ts"
Cohesion: 0.39
Nodes (8): createFakeAdDb(), hydrate(), model(), match(), matchValue(), nextId(), Row, sortRows()

### Community 125 - "events/route.ts"
Cohesion: 0.19
Nodes (12): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), shouldSendSseEvent() (+4 more)

### Community 126 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 127 - "merchant-card-finish.test.ts"
Cohesion: 0.15
Nodes (19): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+11 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.22
Nodes (15): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), isCancellable() (+7 more)

### Community 129 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.25
Nodes (6): DiscoverPage(), Merchant, pickRotatingAd(), Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.35
Nodes (9): GET(), mapEmployee(), employeeLoginUrl(), GET(), mapEmployee(), canExposeInvitationLinkInAdmin(), presetLabel(), statusLabel() (+1 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "qa-login/page.tsx"
Cohesion: 0.38
Nodes (4): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken()

### Community 135 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 136 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 137 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.24
Nodes (11): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert (+3 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "employee-access.test.ts"
Cohesion: 0.53
Nodes (4): assertEarnProgramRules(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie()

### Community 141 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 142 - "campaign-audience.ts"
Cohesion: 0.53
Nodes (5): AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience(), networkAudienceWhere()

### Community 143 - "avatar/route.ts"
Cohesion: 0.33
Nodes (7): DELETE(), AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar(), avatarUploadSchema

### Community 144 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

### Community 145 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 146 - "CampagnesPanel"
Cohesion: 0.18
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.22
Nodes (14): buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), createMembershipInvitation() (+6 more)

### Community 152 - "marketing-balance/route.ts"
Cohesion: 0.14
Nodes (20): POST(), GET(), POST(), topupSchema, getMarketingBalanceCents(), isValidTopupAmountCents(), MAX_TOPUP_CENTS, MIN_TOPUP_CENTS (+12 more)

### Community 153 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 154 - "google-wallet.ts"
Cohesion: 0.24
Nodes (22): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), GoogleWalletImage (+14 more)

### Community 155 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 156 - "solde/ui.tsx"
Cohesion: 0.16
Nodes (15): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, estimateSponsorPricing() (+7 more)

### Community 159 - "merchant-app-access.ts"
Cohesion: 0.14
Nodes (16): CaissePage(), DashboardLayout(), heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS (+8 more)

### Community 160 - "sponsored-hours-pricing.ts"
Cohesion: 0.14
Nodes (15): GET(), computeAdLifecycleStatus(), runAdLifecycleTick(), isSafeAdUrl(), isWithinUtcIntervals(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS (+7 more)

### Community 161 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 166 - "ad-visual-journeys.test.ts"
Cohesion: 0.14
Nodes (15): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, h, jsonRequest() (+7 more)

### Community 172 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.09
Nodes (20): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+12 more)

## Knowledge Gaps
- **919 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+914 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1231 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `webhook/route.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `next-reward-styles.ts`, `react`, `loyalty-program.ts`, `merchant-ad-edit.test.ts`, `employee-session.ts`, `campaign-test-mode-isolation.test.ts`, `google-wallet-doctor.ts`, `loyalty-widget.ts`, `employee-access.test.ts`, `card-editor-canvas.tsx`, `landing-page.test.ts`, `loyalty-service.ts`, `@prisma/client`, `push-client.ts`, `use-wallet-unlock-animation.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `insight-period.ts`, `google-auth.ts`, `customer-preferences-route.test.ts`, `env.ts`, `audit.ts`, `marketing-balance/route.ts`, `loyaltyBalanceForMode`, `super-admin-campaign-moderation.test.ts`, `merchant-app-access.ts`, `sponsored-hours-pricing.ts`, `ads/[id]/confirm/route.ts`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `super-admin-ad-moderation.test.ts`, `ad-visual-journeys.test.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `ref_fs_promises`, `demo-routing.test.ts`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `ref_node_path`, `email.ts`, `insight-stats.ts`, `wallet-hydration.test.tsx`, `loyalty-service.test.ts`, `types.ts`, `platform-stats.ts`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `merchant-card-renderer.tsx`, `ref_next_server`, `unsubscribe/route.ts`, `stripe.ts`, `super-admin-session.ts`, `qr.ts`, `marketing-balance.test.ts`, `customer-reward-progress.ts`, `statistics/route.ts`, `lib/campaign-worker.ts`, `loyalty-commit.ts`, `profile-page.tsx`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `ad-confirm-route.test.ts`, `card-deck.tsx`, `campaign-confirm-route.test.ts`, `loyalty-reward-removal.ts`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `loyalty-program.ts`, `employee-session.ts`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `campaign-audience.ts`, `loyalty-service.ts`, `jsonOk`, `merchant-ui.tsx`, `use-wallet-unlock-animation.ts`, `profile-page.tsx`, `employee-invitation-service.ts`, `jsonError`, `google-auth.ts`, `marketing-balance/route.ts`, `loyaltyBalanceForMode`, `audit.ts`, `google-wallet.ts`, `env.ts`, `layout-shell.tsx`, `merchant-app-access.ts`, `create-super-admin.ts`, `card-editor.tsx`, `package.json`, `sponsored-hours-pricing.ts`, `ads/[id]/confirm/route.ts`, `scan/ui.tsx`, `card-template-schema.ts`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `types.ts`, `platform-stats.ts`, `wallet-home.tsx`, `card-editor-properties.tsx`, `merchant-card-renderer.tsx`, `unsubscribe/route.ts`, `session.ts`, `super-admin-session.ts`, `qr.ts`, `customer-reward-progress.ts`, `lib/campaign-worker.ts`, `loyalty-commit.ts`, `programme/ui.tsx`, `prisma.ts`, `cn`, `events/route.ts`, `loyalty-reward-removal.ts`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `merchants-list.tsx`, `discover-page.tsx`, `merchant-card-template-service.ts`, `src/app/layout.tsx`, `qa-login/page.tsx`, `employee-session.ts`, `card-editor-canvas.tsx`, `@prisma/client`, `merchant-ui.tsx`, `use-wallet-unlock-animation.ts`, `clients/ui.tsx`, `profile-page.tsx`, `use-media-query.ts`, `app/ui.tsx`, `ad-detail.tsx`, `reward-form-dialog.tsx`, `solde/ui.tsx`, `layout-shell.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `scan/ui.tsx`, `invitation/page.tsx`, `card-template-schema.ts`, `src/app/page.tsx`, `wallet-event-dedup.ts`, `wallet-hydration.test.tsx`, `types.ts`, `wallet-home.tsx`, `MerchantCardData`, `card-editor-properties.tsx`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `campaign-moderation-home.tsx`, `campagnes/ui.tsx`, `customer-reward-progress.ts`, `programme/ui.tsx`, `notifications-center.tsx`, `cn`, `card-deck.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _919 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caisse-scan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11379800853485064 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06830601092896176 - nodes in this community are weakly interconnected._
- **Should `src/app/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._